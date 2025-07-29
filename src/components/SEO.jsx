import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  structuredData = null,
  noindex = false,
  canonical = null
}) => {
  const siteName = 'AudioMixingMastering';
  const defaultImage = 'https://static.wixstatic.com/media/cf9233_f1627fce660a4d8c84b587e744a9bc79~mv2.jpg/v1/fill/w_1919,h_1080,al_c/cf9233_f1627fce660a4d8c84b587e744a9bc79~mv2.jpg';
  const siteUrl = 'https://www.audiomixingmastering.com';
  
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Professional Audio Mixing and Mastering Services`;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image || defaultImage;

  // Format keywords for meta tags
  const formatKeywords = (keywords) => {
    if (!keywords) return '';
    
    if (typeof keywords === 'string') {
      return keywords;
    } else if (Array.isArray(keywords)) {
      return keywords.join(', ');
    }
    
    return '';
  };

  const formattedKeywords = formatKeywords(keywords);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {formattedKeywords && <meta name="keywords" content={formattedKeywords} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1919" />
      <meta property="og:image:height" content="1080" />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Default Organization Schema */}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AudioMixingMastering",
            "url": siteUrl,
            "logo": `${siteUrl}/src/assets/images/logo.png`,
            "description": "Professional audio mixing and mastering services with over 25 years of experience",
            "sameAs": [
              "https://www.facebook.com/audiomixingmastering",
              "https://twitter.com/audiomixingmastering",
              "https://www.instagram.com/audiomixingmastering"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-4567",
              "contactType": "customer service",
              "email": "support@audiomixingmastering.com"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO; 