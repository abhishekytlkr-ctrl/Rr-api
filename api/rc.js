import requests
import uuid
import json

def handler(request):
    try:
        # ✅ Query param safely get
        rc = request.query.get("rc")

        if not rc:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "RC parameter required"})
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

        response = requests.post(
            "https://api1.91wheels.com/api/v1/third/rc-detail",
            headers=headers,
            json=payload,
            timeout=15
        )

        data = response.json()

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "success": True,
                "rc": rc,
                "data": data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "success": False,
                "error": str(e)
            })
        }
