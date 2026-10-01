import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema(
  {
    marqueeText: {
      type: String,
      default: 'FW25 Drop 01 Available Worldwide • Complimentary Express Atelier Shipping on Orders Over ₹15,000',
    },
    archiveText: {
      type: String,
      default: 'Archive Curated // FW25',
    },
    heroHeadline: {
      type: String,
      default: 'New Season Drop',
    },
    heroSubheadline: {
      type: String,
      default: 'Minimalist silhouettes engineered for modern architectural movement. Double-faced wool, tech poplin, and structured forms.',
    },
    heroImage: {
      type: String,
      default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1ps0HdAx9ANRgkAI528SZuWNXqJ1WKlkHgpfYv2ybbogGSlvqSLviao-pPVvWvntNgt4clC3ZQhMQIMFLNn_yQ59lbpIKnLB_AYCQqkq9ojMmahSUtbSMwG8H-60x_Lu2FeCmwkOtbCE-FILoiZ7CBr6FaRHRM1oDOLigIDAVVCI14XVvM4wCnVUSqzxvhyHyfTadWCC0SkD4BjDQlxUHqLLgMszYK8LthVcUcm1CJex1S2t2GP57',
    },
    heroDropTag: {
      type: String,
      default: 'Drop 01 // Autumn Winter 2025',
    },
    winterDropHeroImage: {
      type: String,
      default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBqMfest0YG8OFoCNADoIuzQNXFvjHQz2qD4iHKt4M2NL1THc1d1j4Ve6CQKqxTspCVBdi-1mJl8CllfgjnfMMuVL904tsYa3couHqcPC7O6BReTg750LSGbffD4s-TQ0baAn9dlIUyrj5ugjKut3LsWVR-SpcWyQuXldc1P4Ux3Z9XADwIXLlYW0aQihiPmiYZiMNNP5mzYei0bFl-2WuwK_hp1f32TqRjnTgZBFtAfXkEQ0q-Pj6',
    },
    winterDropTargetDate: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);
export default SiteConfig;
