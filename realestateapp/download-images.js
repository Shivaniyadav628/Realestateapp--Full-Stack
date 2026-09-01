const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✓ Created uploads folder");
}

// Image URLs from free sources (Unsplash, Pexels, Pixabay)
// Using direct image URLs that don't require API keys
const imageUrls = [
  // Apartments
  {
    filename: "apt1.jpg",
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=800",
    description: "Luxury Apartment",
  },
  {
    filename: "studio1.jpg",
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&t=1",
    fallback: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?w=800",
    description: "Studio Apartment",
  },
  {
    filename: "apt_budget.jpg",
    url: "https://images.unsplash.com/photo-1545324418-cc1a9d6fdf60?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=800",
    description: "Budget Apartment",
  },
  {
    filename: "apt_garden.jpg",
    url: "https://images.unsplash.com/photo-1551524164-0fcac8f13e6f?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?w=800",
    description: "Garden Apartment",
  },
  {
    filename: "apt_modern.jpg",
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?w=800",
    description: "Modern Apartment",
  },
  {
    filename: "penthouse1.jpg",
    url: "https://images.unsplash.com/photo-1512917774080-9b71b3b22460?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=800",
    description: "Penthouse",
  },
  {
    filename: "apt_premium.jpg",
    url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?w=800",
    description: "Premium Apartment",
  },
  {
    filename: "apt_contemporary.jpg",
    url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?w=800",
    description: "Contemporary Apartment",
  },
  // Houses
  {
    filename: "house1.jpg",
    url: "https://images.unsplash.com/photo-1570129477492-45c003cedd70?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800",
    description: "House with Garden",
  },
  {
    filename: "house_pool.jpg",
    url: "https://images.unsplash.com/photo-1613490493976-fdf092f958af?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800",
    description: "House with Pool",
  },
  {
    filename: "cottage.jpg",
    url: "https://images.unsplash.com/photo-1605276374104-dee2a0db896d?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?w=800",
    description: "Cottage",
  },
  {
    filename: "house_rent.jpg",
    url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800",
    description: "House for Rent",
  },
  // Villas
  {
    filename: "villa1.jpg",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=800",
    description: "Beach Villa",
  },
  {
    filename: "villa_mountain.jpg",
    url: "https://images.unsplash.com/photo-1564501049559-c1fb5f623b42?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?w=800",
    description: "Mountain Villa",
  },
  {
    filename: "villa_modern.jpg",
    url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=800",
    description: "Modern Villa",
  },
  // Townhouses
  {
    filename: "townhouse1.jpg",
    url: "https://images.unsplash.com/photo-1600607687644-c173492dc358?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?w=800",
    description: "Historic Townhouse",
  },
  {
    filename: "townhouse_modern.jpg",
    url: "https://images.unsplash.com/photo-1600607687920-4e52a09f1c35?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800",
    description: "Modern Townhouse",
  },
  {
    filename: "townhouse_rent.jpg",
    url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?w=800",
    description: "Townhouse Rental",
  },
  // Commercial
  {
    filename: "office1.jpg",
    url: "https://images.unsplash.com/photo-1497366216548-bc8d7e05b89f?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=800",
    description: "Office Space",
  },
  {
    filename: "commercial.jpg",
    url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800",
    description: "Commercial Building",
  },
  {
    filename: "retail.jpg",
    url: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?w=800",
    description: "Retail Shop",
  },
  {
    filename: "office_building.jpg",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=800",
    description: "Office Building",
  },
  // Plots
  {
    filename: "plot1.jpg",
    url: "https://images.unsplash.com/photo-1500382017468-7049ffa23f34?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?w=800",
    description: "Residential Plot",
  },
  {
    filename: "plot_industrial.jpg",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=800",
    description: "Industrial Plot",
  },
  {
    filename: "land_agricultural.jpg",
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
    fallback: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800",
    description: "Agricultural Land",
  },
];

let downloadedCount = 0;
let errorCount = 0;

// Function to download image with fallback
const downloadImage = (imageObj, isRetry = false) => {
  return new Promise((resolve) => {
    const filePath = path.join(uploadsDir, imageObj.filename);

    // Check if image already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Already exists: ${imageObj.filename}`);
      resolve();
      return;
    }

    const url = isRetry ? imageObj.fallback : imageObj.url;
    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          downloadImage({ ...imageObj, url: redirectUrl }, isRetry).then(resolve);
          return;
        }

        if (response.statusCode !== 200) {
          if (!isRetry && imageObj.fallback) {
            // Try fallback URL
            console.log(`↻ Retrying ${imageObj.filename} with fallback...`);
            downloadImage(imageObj, true).then(resolve);
            return;
          } else {
            console.log(
              `✗ Failed to download ${imageObj.filename}: Status ${response.statusCode}`
            );
            errorCount++;
            resolve();
            return;
          }
        }

        const file = fs.createWriteStream(filePath);

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log(`✓ Downloaded: ${imageObj.filename} (${imageObj.description})`);
          downloadedCount++;
          resolve();
        });

        file.on("error", (err) => {
          fs.unlink(filePath, () => {}); // Delete incomplete file
          if (!isRetry && imageObj.fallback) {
            console.log(`↻ Retrying ${imageObj.filename} with fallback...`);
            downloadImage(imageObj, true).then(resolve);
          } else {
            console.log(`✗ Error downloading ${imageObj.filename}: ${err.message}`);
            errorCount++;
            resolve();
          }
        });
      })
      .on("error", (err) => {
        if (!isRetry && imageObj.fallback) {
          console.log(`↻ Retrying ${imageObj.filename} with fallback...`);
          downloadImage(imageObj, true).then(resolve);
        } else {
          console.log(`✗ Error downloading ${imageObj.filename}: ${err.message}`);
          errorCount++;
          resolve();
        }
      });
  });
};

// Download all images sequentially
async function downloadAllImages() {
  console.log("🖼️  Starting image download...\n");

  for (const imageObj of imageUrls) {
    await downloadImage(imageObj);
  }

  console.log(`\n📊 Download Complete!`);
  console.log(`✓ Successfully downloaded: ${downloadedCount} images`);
  if (errorCount > 0) {
    console.log(`✗ Failed: ${errorCount} images`);
  }
  console.log(
    `\n🎉 Images are ready! Your properties now have pictures.\n`
  );
  console.log(`Location: ${uploadsDir}\n`);

  process.exit(0);
}

downloadAllImages().catch((error) => {
  console.error("❌ Download failed:", error.message);
  process.exit(1);
});
