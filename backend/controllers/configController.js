import SiteConfig from '../models/SiteConfig.js';

/**
 * @desc Get Site Configuration (Hero banner, countdown timer, marquee text)
 * @route GET /api/config
 */
export const getSiteConfig = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();

    if (!config) {
      config = await SiteConfig.create({});
    }

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Error fetching site config:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update Site Configuration (Admin)
 * @route PUT /api/config
 */
export const updateSiteConfig = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();

    if (!config) {
      config = await SiteConfig.create(req.body);
    } else {
      config = await SiteConfig.findByIdAndUpdate(config._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Site configuration updated successfully',
      data: config,
    });
  } catch (error) {
    console.error('Error updating site config:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
