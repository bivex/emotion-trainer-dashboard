/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-29T00:00:00
 * Last Updated: 2025-12-29T00:00:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = "Neural Emotion Scanner - AI-Powered Emotion Recognition Training",
  description = "Advanced neural network for emotion recognition training. Decode facial expressions with precision using our AI-powered emotion analysis tool. Train your skills in recognizing joy, sadness, anger, fear, surprise, disgust, guilt, shame, suspicion, and neutral expressions.",
  keywords = "emotion recognition, facial expression analysis, AI training, neural network, emotion detection, facial microexpressions, emotion training, psychology, machine learning, computer vision",
  image = "/favicon.png",
  url = window.location.href,
  type = "website",
  author = "Bivex",
  publishedTime,
  modifiedTime,
  section = "Technology",
  tags = ["AI", "Emotion Recognition", "Training", "Neural Network", "Psychology"]
}) => {
  const siteName = "Neural Emotion Scanner";
  const twitterHandle = "@emotion_scanner";

  // Structured data for the emotion recognition tool
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Neural Emotion Scanner",
    "description": description,
    "url": window.location.origin,
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Bivex",
      "url": "https://github.com/bivex"
    },
    "featureList": [
      "Real-time emotion recognition",
      "Facial expression analysis",
      "Neural network training",
      "Interactive learning interface",
      "Multi-language support",
      "Performance tracking"
    ],
    "keywords": keywords.split(", "),
    "inLanguage": ["en", "ru", "zh", "es"],
    "datePublished": publishedTime || "2025-12-28",
    "dateModified": modifiedTime || "2025-12-28",
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bivex"
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": window.location.href,
      "description": "Start emotion recognition training"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${window.location.origin}${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${window.location.origin}${image}`} />

      {/* Article Specific Meta Tags (if applicable) */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      {type === "article" && tags && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Additional Meta Tags for SEO */}
      <meta name="theme-color" content="#00ff41" />
      <meta name="msapplication-TileColor" content="#00ff41" />
      <meta name="application-name" content={siteName} />

      {/* Mobile Specific Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
