import { 
  getAdvancedAnalyticsByFormId, 
  getUserAnalytics,
  getFormSummary 
} from "../services/advancedAnalytics.service.js";

export const getAdvancedAnalytics = async (req, res) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({ 
        success: false, 
        message: "formId is required" 
      });
    }

    const analytics = await getAdvancedAnalyticsByFormId(formId);

    res.status(200).json({ 
      success: true, 
      data: analytics 
    });
  } catch (err) {
    console.error("Advanced analytics error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const getUserAnalyticsData = async (req, res) => {
  try {
    const { formId, userId } = req.params;

    if (!formId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: "formId and userId are required" 
      });
    }

    const analytics = await getUserAnalytics(formId, userId);

    res.status(200).json({ 
      success: true, 
      data: analytics 
    });
  } catch (err) {
    console.error("User analytics error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const getFormAnalyticsSummary = async (req, res) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({ 
        success: false, 
        message: "formId is required" 
      });
    }

    const summary = await getFormSummary(formId);

    res.status(200).json({ 
      success: true, 
      data: summary 
    });
  } catch (err) {
    console.error("Form summary error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

