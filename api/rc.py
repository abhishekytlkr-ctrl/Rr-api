import requests
import uuid
import json

def handler(request):
    try:
        rc = request.query.get("rc")

        if not rc:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "RC required"})
            }

        rc = rc.strip().upper()

        payload = {
            "regNo": rc,
            "sessionid": str(uuid.uuid4())
        }

        headers = {
            "Content-Type": "application/json",
            "Origin": "https://www.91wheels.com",
            "Referer": "https://www.91wheels.com/",
            "User-Agent": "Mozilla/5.0"
        }

        res = requests.post(
            "https://api1.91wheels.com/api/v1/third/rc-detail",
            json=payload,
            headers=headers,
            timeout=15
        )

        raw = res.json()
        data = raw.get("data", {}).get("data", {})

        result = {
            "vehicle_number": data.get("rc_number"),
            "owner_name": data.get("owner_name"),
            "father_name": data.get("father_name"),
            "present_address": data.get("present_address"),
            "permanent_address": data.get("permanent_address"),

            "vehicle_details": {
                "model": data.get("maker_model"),
                "maker": data.get("maker_description"),
                "fuel_type": data.get("fuel_type"),
                "color": data.get("color"),
                "body_type": data.get("body_type"),
                "category": data.get("vehicle_category_description")
            },

            "registration": {
                "date": data.get("registration_date"),
                "rto": data.get("registered_at"),
                "status": data.get("rc_status")
            },

            "compliance": {
                "insurance_upto": data.get("insurance_upto"),
                "insurance_company": data.get("insurance_company"),
                "policy_number": data.get("insurance_policy_number"),
                "pucc_upto": data.get("pucc_upto"),
                "pucc_number": data.get("pucc_number"),
                "tax_upto": data.get("tax_upto"),
                "tax_paid_upto": data.get("tax_paid_upto"),
                "blacklist_status": data.get("blacklist_status")
            },

            "technical": {
                "engine": data.get("vehicle_engine_number"),
                "chassis": data.get("vehicle_chasi_number"),
                "cc": data.get("cubic_capacity"),
                "cylinders": data.get("no_cylinders"),
                "weight": data.get("vehicle_gross_weight")
            }
        }

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "success": True,
                "data": result
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
