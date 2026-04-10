const cache = {};

export default async function handler(req, res) {
  try {
    const rc = req.query.rc;

    if (!rc) {
      return res.status(400).json({ error: "RC required" });
    }

    const RC = rc.toUpperCase();

    // ✅ CACHE (fast + less limit)
    if (cache[RC]) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cache[RC]
      });
    }

    // 🔥 MAIN API (91wheels)
    const response = await fetch("https://api1.91wheels.com/api/v1/third/rc-detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://www.91wheels.com",
        "Referer": "https://www.91wheels.com/",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        regNo: RC,
        sessionid: Math.random().toString()
      })
    });

    const raw = await response.json();

    // 🔥 SAFE extract (all cases handle)
    const d = raw?.data?.data || raw?.data || {};

    // ❌ empty check
    if (!d || Object.keys(d).length === 0) {
      return res.status(200).json({
        success: false,
        message: "No data found (API returned empty)"
      });
    }

    // ✅ FINAL STRUCTURED OUTPUT (screenshot jaisa)
    const result = {
      owner_details: {
        name: d.owner_name,
        father_name: d.father_name,
        present_address: d.present_address,
        permanent_address: d.permanent_address
      },

      vehicle_details: {
        number: d.rc_number,
        model: d.maker_model,
        maker: d.maker_description,
        fuel_type: d.fuel_type,
        color: d.color,
        body_type: d.body_type,
        category: d.vehicle_category_description
      },

      registration: {
        date: d.registration_date,
        rto: d.registered_at,
        status: d.rc_status
      },

      insurance: {
        company: d.insurance_company,
        policy_number: d.insurance_policy_number,
        valid_upto: d.insurance_upto
      },

      pucc: {
        number: d.pucc_number,
        valid_upto: d.pucc_upto
      },

      tax: {
        tax_upto: d.tax_upto,
        tax_paid_upto: d.tax_paid_upto
      },

      finance: {
        financer: d.financer,
        blacklist_status: d.blacklist_status
      },

      technical: {
        engine_number: d.vehicle_engine_number,
        chassis_number: d.vehicle_chasi_number,
        cubic_capacity: d.cubic_capacity,
        cylinders: d.no_cylinders,
        weight: d.vehicle_gross_weight
      }
    };

    // ✅ SAVE CACHE
    cache[RC] = result;

    return res.status(200).json({
      success: true,
      source: "live",
      data: result
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
