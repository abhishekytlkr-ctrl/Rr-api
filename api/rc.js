export default async function handler(req, res) {
  try {
    const rc = req.query.rc;

    if (!rc) {
      return res.status(400).json({ error: "RC required" });
    }

    const response = await fetch("https://api1.91wheels.com/api/v1/third/rc-detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://www.91wheels.com",
        "Referer": "https://www.91wheels.com/",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        regNo: rc.toUpperCase(),
        sessionid: Math.random().toString()
      })
    });

    const raw = await response.json();
    const data = raw?.data?.data || {};

    return res.status(200).json({
      success: true,
      data: {
        owner: data.owner_name,
        vehicle: data.maker_model,
        fuel: data.fuel_type,
        pucc_number: data.pucc_number,
        insurance_policy: data.insurance_policy_number,
        tax_upto: data.tax_upto
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
