from flask import Flask, jsonify
from datetime import datetime, timedelta
from pymongo import MongoClient
import csv

app = Flask(__name__)

class payGeneration:
    def __init__(self, tips, hours, payRate, date):
        self.tips = tips
        self.hours = hours
        self.payRate = payRate
        self.date = date
        
    def calculateTotalPay(self):
        basePay = self.hours * self.payRate
        totalPay = basePay + self.tips
        return totalPay

class CsvCompareDatabase:
    def __init__(self, csv_data, database_data):
        self.csv_data = csv_data
        self.database_data = database_data

    def parse_time(self, time_str):
        # Parsing time string without AM/PM for easier comparison
        return datetime.strptime(time_str.replace(" AM", "").replace(" PM", ""), "%I:%M")

    def parse_date(self, date_str):
        # Try parsing the date in both formats
        for fmt in ("%m/%d/%Y", "%m-%d-%Y"):
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        raise ValueError(f"Date '{date_str}' is not in a recognized format.")


    def csv_compare(self):
        green_alert = 'Green Alert'
        amber_alert = 'Amber Alert'
        red_alert = 'Red Alert'

        try:
            # Parsing clock-in and clock-out times for both CSV and Database data
            csv_array = [self.parse_time(time_str) if i in [3, 5] else time_str for i, time_str in enumerate(self.csv_data)]
            database_array = [self.parse_time(time_str) if i in [3, 4] else time_str for i, time_str in enumerate(self.database_data)]
            
            # Parse dates from the CSV and database
            clock_in_date = self.parse_date(self.csv_data[2])  # Clock-in date from CSV
            clock_out_date = self.parse_date(self.csv_data[4])  # Clock-out date from CSV
            paid_time_in_date = self.parse_date(self.database_data[2])  # This is the date for paidTimeIn

            # Calculate the date for paidTimeOut
            if database_array[4] < database_array[3]:
                paid_time_out_date = paid_time_in_date + timedelta(days=1)  # Increment to next day
            else:
                database_array[4] = database_array[3]  # Same day

            early_time_in = database_array[3] - timedelta(minutes=15)
            late_time_in = database_array[3] + timedelta(minutes=10)
            early_time_out = database_array[4] - timedelta(minutes=15)
            late_time_out = database_array[4] + timedelta(minutes=10)

            # Compare name, location, and clock-in date
            if (csv_array[0].strip().upper() == database_array[0].strip().upper() and
                csv_array[1].strip().lower() == database_array[1].strip().lower() and 
                clock_in_date == paid_time_in_date):

                # Compare clock-in and clock-out times
                if early_time_in <= csv_array[3] <= late_time_in and early_time_out <= csv_array[5] <= late_time_out:
                    # Check if the paid_time_out_date matches the clock-out date
                    if paid_time_out_date.date() == clock_out_date.date():  # Compare the date part
                        return green_alert
                    else:
                        return red_alert  # Dates do not match
                elif late_time_in >= csv_array[3] > database_array[3] or late_time_out >= csv_array[5] > database_array[4]:
                    return amber_alert
                else:
                    return red_alert
            else:
                return red_alert
        except Exception as e:
            # Exception handling to catch and report errors
            print(f"Error processing time data: {e}")
            return red_alert

@app.route('/compare', methods=['GET'])
def compare():
    try:
        # Connecting to MongoDB
        client = MongoClient('mongodb+srv://ParkingSystemsAtlas2:rcub6cGiVYM3JiNJ@pkcserver.kucpp.mongodb.net/')
        db = client['ParkingSystemsDBdev']
        collection = db['Scheduler']

        # Test if the connection was successful
        print("Connected to MongoDB successfully!")

    except Exception as e:
        print("Failed to connect to MongoDB:", e)
        return jsonify({"error": "Failed to connect to database"}), 500    

    # Example CSV data
    csv_data = [
        "Pierre Thevenot", "Regency Condos", "12/11/2023", "7:10 AM", "12/11/2023", "11:05 AM"
    ]

    # Fetching data from MongoDB
    database_data = collection.find_one({    # Adjust the query as needed
        "firstName": "PIERRE", 
        "lastName": "THEVENOT", 
        "location": "Regency Condos", 
        "date": "12-11-2023"
    })  
    
    if database_data is None:
        print("No matching document found in the database.")
    else:
        # Print the retrieved data for debugging
        print("Database Data:", database_data)
        database_data_str = [
        f"{database_data['firstName']} {database_data['lastName']}", 
        database_data['location'], 
        database_data['date'], 
        database_data['paidTimeIn'], 
        database_data['paidTimeOut']
    ]

    # Creating a comparison instance
    csv_compare_instance = CsvCompareDatabase(csv_data, database_data_str)
    comparison_result = csv_compare_instance.csv_compare()

    # Preparing JSON data in the required format
    data = [{
        'Employee Name': csv_data[0],
        'Location': csv_data[1],
        'Clock-In Date': csv_data[2],
        'Ordered Time In': database_data['paidTimeIn'] if database_data else None,
        'Clock-In Time': csv_data[3],
        'Clock-Out Date': csv_data[4],
        'Ordered Time Out': database_data['paidTimeOut'] if database_data else None,
        'Clock-Out Time': csv_data[5],
        'Comparison Result': comparison_result
    }]

    print("Final Data to return:", data)  # For debugging
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
        



