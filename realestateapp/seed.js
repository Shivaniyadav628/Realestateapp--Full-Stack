const db = require("./config/db");
require("dotenv").config();

// EXPANDED Sample property data with 25+ properties
const sampleProperties = [
  // APARTMENTS - RENT
  {
    user_id: 1,
    title: "Luxury Apartment in Downtown",
    description:
      "Beautiful 2-bedroom luxury apartment in the heart of downtown with modern amenities, gym, and parking.",
    property_type: "Apartment",
    purpose: "Rent",
    price: 2500,
    location: "Downtown, City Center",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    image: "apt1.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Cozy Studio Apartment",
    description:
      "Perfect starter apartment. Fully furnished with kitchen, living area, and bedroom. Close to public transport.",
    property_type: "Apartment",
    purpose: "Rent",
    price: 1200,
    location: "Midtown, Arts District",
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    image: "studio1.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Affordable 1BHK Apartment",
    description:
      "Budget-friendly 1-bedroom apartment with basic amenities. Ideal for students and young professionals.",
    property_type: "Apartment",
    purpose: "Rent",
    price: 800,
    location: "University District",
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    image: "apt_budget.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Garden Apartment with Patio",
    description:
      "Ground floor apartment with private patio, garden access, and in-unit laundry. Quiet neighborhood.",
    property_type: "Apartment",
    purpose: "Rent",
    price: 1800,
    location: "Garden District",
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    image: "apt_garden.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Modern 2BHK Apartment with Balcony",
    description:
      "Spacious 2-bedroom apartment with stunning balcony views, modern kitchen, and AC in all rooms.",
    property_type: "Apartment",
    purpose: "Rent",
    price: 1500,
    location: "Riverside Complex",
    bedrooms: 2,
    bathrooms: 2,
    area: 850,
    image: "apt_modern.jpg",
    status: "Available",
  },
  // APARTMENTS - SALE
  {
    user_id: 1,
    title: "Penthouse with City View",
    description:
      "Stunning penthouse on the 45th floor with panoramic city views, private terrace, and luxury finishes.",
    property_type: "Apartment",
    purpose: "Sale",
    price: 1200000,
    location: "Downtown Towers",
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    image: "penthouse1.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Premium 3BHK Apartment",
    description:
      "Luxurious 3-bedroom apartment with premium finishes, smart home features, and dedicated parking.",
    property_type: "Apartment",
    purpose: "Sale",
    price: 850000,
    location: "Elite Residences",
    bedrooms: 3,
    bathrooms: 3,
    area: 1600,
    image: "apt_premium.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Contemporary 2BHK Apartment",
    description:
      "Modern 2-bedroom apartment with floor-to-ceiling windows, open kitchen, and contemporary design.",
    property_type: "Apartment",
    purpose: "Sale",
    price: 650000,
    location: "Skyline Plaza",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    image: "apt_contemporary.jpg",
    status: "Available",
  },
  // HOUSES
  {
    user_id: 1,
    title: "Modern House with Garden",
    description:
      "Spacious 4-bedroom house with backyard, driveway, and modern kitchen. Perfect for families.",
    property_type: "House",
    purpose: "Sale",
    price: 450000,
    location: "Suburban Heights",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    image: "house1.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Family Home with Pool",
    description:
      "Beautiful 5-bedroom family home with swimming pool, large garden, and entertainment area.",
    property_type: "House",
    purpose: "Sale",
    price: 750000,
    location: "Oak Valley",
    bedrooms: 5,
    bathrooms: 4,
    area: 3200,
    image: "house_pool.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Cozy Country Cottage",
    description:
      "Charming 3-bedroom cottage on 2 acres with rustic charm, fireplace, and peaceful surroundings.",
    property_type: "House",
    purpose: "Sale",
    price: 320000,
    location: "Rural Countryside",
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    image: "cottage.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "3BHK House for Rent",
    description:
      "Well-maintained 3-bedroom house in a family-friendly neighborhood with good schools and parks.",
    property_type: "House",
    purpose: "Rent",
    price: 2000,
    location: "Peaceful Suburbia",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: "house_rent.jpg",
    status: "Available",
  },
  // VILLAS
  {
    user_id: 1,
    title: "Beach Villa",
    description:
      "Exclusive beachfront villa with direct beach access, infinity pool, and resort-like amenities.",
    property_type: "Villa",
    purpose: "Sale",
    price: 2500000,
    location: "Coastal Paradise",
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    image: "villa1.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Mountain Retreat Villa",
    description:
      "Luxurious villa nestled in mountains with panoramic views, spa, and outdoor entertainment areas.",
    property_type: "Villa",
    purpose: "Sale",
    price: 1800000,
    location: "Highland Estate",
    bedrooms: 4,
    bathrooms: 4,
    area: 3000,
    image: "villa_mountain.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Modern Villa with Landscaping",
    description:
      "Contemporary villa featuring smart home technology, landscaped gardens, and infinity pool.",
    property_type: "Villa",
    purpose: "Sale",
    price: 2200000,
    location: "Exclusive Gated Community",
    bedrooms: 5,
    bathrooms: 5,
    area: 4000,
    image: "villa_modern.jpg",
    status: "Available",
  },
  // TOWNHOUSES
  {
    user_id: 1,
    title: "Charming Historic Townhouse",
    description:
      "Renovated Victorian townhouse with original hardwood floors, fireplace, and updated kitchen.",
    property_type: "Townhouse",
    purpose: "Sale",
    price: 550000,
    location: "Historic District",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: "townhouse1.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Modern Townhouse",
    description:
      "Sleek 3-story townhouse with open-plan living, rooftop terrace, and underground parking.",
    property_type: "Townhouse",
    purpose: "Sale",
    price: 650000,
    location: "Urban District",
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    image: "townhouse_modern.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Townhouse for Rent",
    description:
      "Spacious 2-bedroom townhouse with modern amenities, close to schools and shopping centers.",
    property_type: "Townhouse",
    purpose: "Rent",
    price: 1600,
    location: "Family Neighborhood",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "townhouse_rent.jpg",
    status: "Available",
  },
  // COMMERCIAL
  {
    user_id: 1,
    title: "Commercial Office Space",
    description:
      "Modern office space with 5 workstations, conference room, and break area. Prime business location.",
    property_type: "Commercial",
    purpose: "Rent",
    price: 3500,
    location: "Business Park",
    bedrooms: 0,
    bathrooms: 2,
    area: 1200,
    image: "office1.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Investment Property - Commercial Building",
    description:
      "Multi-unit commercial building with retail space on ground floor and offices above. Strong rental income.",
    property_type: "Commercial",
    purpose: "Sale",
    price: 800000,
    location: "Commercial District",
    bedrooms: 0,
    bathrooms: 4,
    area: 4000,
    image: "commercial.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Retail Shop Space",
    description:
      "Prime retail location with high foot traffic, excellent visibility, and flexible lease terms.",
    property_type: "Commercial",
    purpose: "Rent",
    price: 2500,
    location: "Shopping Mall",
    bedrooms: 0,
    bathrooms: 1,
    area: 800,
    image: "retail.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Corporate Office Building",
    description:
      "State-of-the-art office building with 10 floors, modern facilities, and advanced security.",
    property_type: "Commercial",
    purpose: "Sale",
    price: 5000000,
    location: "Business Central",
    bedrooms: 0,
    bathrooms: 10,
    area: 15000,
    image: "office_building.jpg",
    status: "Available",
  },
  // PLOTS
  {
    user_id: 1,
    title: "Residential Plot in Prime Location",
    description:
      "Well-located residential plot with clear title, suitable for residential development.",
    property_type: "Plot",
    purpose: "Sale",
    price: 200000,
    location: "Development Zone",
    bedrooms: 0,
    bathrooms: 0,
    area: 2000,
    image: "plot1.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Industrial Plot",
    description:
      "Large industrial plot with excellent connectivity and infrastructure. Ideal for manufacturing.",
    property_type: "Plot",
    purpose: "Sale",
    price: 500000,
    location: "Industrial Estate",
    bedrooms: 0,
    bathrooms: 0,
    area: 5000,
    image: "plot_industrial.jpg",
    status: "Available",
  },
  {
    user_id: 1,
    title: "Agricultural Land",
    description:
      "Fertile agricultural land perfect for farming or organic produce cultivation. Water supply assured.",
    property_type: "Plot",
    purpose: "Sale",
    price: 150000,
    location: "Farmlands",
    bedrooms: 0,
    bathrooms: 0,
    area: 10000,
    image: "land_agricultural.jpg",
    status: "Available",
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // First check if user_id 1 exists
    const [users] = await db.promise().query("SELECT id FROM users WHERE id = 1");

    if (users.length === 0) {
      console.log("❌ Error: User with ID 1 not found!");
      console.log("ℹ️  Please make sure you have at least one user in the database.");
      console.log("ℹ️  You can create a user by registering through the frontend first.\n");
      process.exit(1);
    }

    console.log("✓ User ID 1 found\n");

    // Clear existing properties (optional - comment out if you want to keep existing data)
    // const deleteResult = await db.promise().query("DELETE FROM properties");
    // console.log(`Deleted ${deleteResult[0].affectedRows} existing properties\n`);

    // Insert sample properties
    let successCount = 0;
    let errorCount = 0;

    for (const property of sampleProperties) {
      try {
        const query =
          "INSERT INTO properties (user_id, title, description, property_type, purpose, price, location, bedrooms, bathrooms, area, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const values = [
          property.user_id,
          property.title,
          property.description,
          property.property_type,
          property.purpose,
          property.price,
          property.location,
          property.bedrooms,
          property.bathrooms,
          property.area,
          property.image,
          property.status,
        ];

        await db.promise().query(query, values);
        console.log(`✓ Added: ${property.title}`);
        successCount++;
      } catch (error) {
        console.log(`✗ Error adding "${property.title}": ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 Seeding Complete!`);
    console.log(`✓ Successfully added: ${successCount} properties`);
    if (errorCount > 0) {
      console.log(`✗ Failed: ${errorCount} properties`);
    }
    console.log(
      "\n🎉 Your database is now populated with sample real estate data!"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
