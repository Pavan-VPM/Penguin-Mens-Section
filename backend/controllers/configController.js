import mongoose from 'mongoose';
import SiteConfig from '../models/SiteConfig.js';

let inMemoryConfig = {
  marqueeText: 'FW25 Drop 01 Available Worldwide • Complimentary Express Atelier Shipping',
  archiveText: 'Archive Curated // FW25',
  heroHeadline: 'New Season Drop',
  heroSubheadline: 'Minimalist silhouettes engineered for modern architectural movement. Double-faced wool, tech poplin, and structured forms.',
  heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1ps0HdAx9ANRgkAI528SZuWNXqJ1WKlkHgpfYv2ybbogGSlvqSLviao-pPVvWvntNgt4clC3ZQhMQIMFLNn_yQ59lbpIKnLB_AYCQqkq9ojMmahSUtbSMwG8H-60x_Lu2FeCmwkOtbCE-FILoiZ7CBr6FaRHRM1oDOLigIDAVVCI14XVvM4wCnVUSqzxvhyHyfTadWCC0SkD4BjDQlxUHqLLgMszYK8LthVcUcm1CJex1S2t2GP57',
  heroDropTag: 'Drop 01 // Autumn Winter 2025',
  showWinterDrop: true,
  winterDropTitle: 'WINTER DROP 01',
  winterDropSubtitle: 'Limited capsule — Structured outerwear, heavyweight knitwear & tech bombers. Only 100 units per style.',
  winterDropCta: 'Shop Winter Drop',
  winterDropImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
  countdownEnd: new Date(Date.now() + 14 * 86400000).toISOString(),
};

/**
 * @desc Get Site Configuration (Hero banner, countdown timer, marquee text)
 * @route GET /api/config
 */
export const getSiteConfig = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let config = await SiteConfig.findOne();
      if (!config) {
        config = await SiteConfig.create({});
      }
      return res.status(200).json({
        success: true,
        data: config,
      });
    }

    return res.status(200).json({
      success: true,
      data: inMemoryConfig,
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
    if (mongoose.connection.readyState === 1) {
      let config = await SiteConfig.findOne();

      if (!config) {
        config = await SiteConfig.create(req.body);
      } else {
        config = await SiteConfig.findByIdAndUpdate(config._id, req.body, {
          new: true,
          runValidators: true,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Site configuration updated successfully',
        data: config,
      });
    }

    inMemoryConfig = {
      ...inMemoryConfig,
      ...req.body,
    };

    return res.status(200).json({
      success: true,
      message: 'Site configuration updated successfully (In-Memory)',
      data: inMemoryConfig,
    });
  } catch (error) {
    console.error('Error updating site config:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
