const User = require("../models/User");
const Campsite = require("../models/Campsite");
const Reservation = require("../models/Reservation");
const mongoose = require("mongoose");

const seedDatabase = async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Campsite.deleteMany({});
    await Reservation.deleteMany({});

    // Drop old username index if it exists
    try {
      await User.collection.dropIndex("username_1");
    } catch (e) {
      // Index might not exist, ignore
    }

    // Define fixed IDs for predictable testing
    const userIds = [
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"), // admin
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"), // user1
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"), // user2
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439014"), // user3
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439015"), // user4
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439016"), // user5
    ];

    const campsiteIds = [
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439021"), // tente Lac A
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439022"), // tente Lac B
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439023"), // RV Paradis Deluxe
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439024"), // RV Écono
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439025"), // Chalet Montagne Prestige
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439026"), // Chalet Forêt Boréale
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439027"), // Tente prêt-à-camper
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439028"), // Site de randonnée sauvage
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439029"), // RV Premium
    ];

    const reservationIds = [
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439031"), // admin - tente Lac A July 1-3
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439032"), // user1 - tente Lac B July 5-8
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439033"), // user2 - RV Paradis Deluxe July 10-12
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439034"), // user3 - RV Écono July 15-17
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439035"), // user4 - Chalet Montagne Prestige July 20-25
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439036"), // admin - Chalet Forêt Boréale Aug 1-4
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439037"), // user1 - Tente prêt-à-camper Aug 8-10
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439038"), // user2 - Site de randonnée sauvage Aug 12-14
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439039"), // user3 - tente Lac A Aug 18-20
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439040"), // user4 - RV Paradis Deluxe Aug 25-28
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439041"), // admin - RV Écono July 28-30
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439042"), // user1 - Chalet Forêt Boréale Aug 15-17
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439043"), // user1 - Site de randonnée sauvage Sep 1-3 (confirmed)
      new mongoose.Types.ObjectId("507f1f77bcf86cd799439044"), // user1 - RV Premium Sep 5-7 (cancelled)
    ];

    // Create users
    const admin = new User({
      _id: userIds[0],
      firstName: "Admin",
      lastName: "User",
      email: "admin@campxplore.com",
      phone: "5141234567",
      password: "Password123!",
      role: "admin",
    });
    await admin.save();

    const users = [
      {
        _id: userIds[1],
        firstName: "User",
        lastName: "User",
        email: "user@campxplore.com",
        phone: "4182345678",
        password: "Password123!",
      },
      {
        _id: userIds[2],
        firstName: "Bob",
        lastName: "Smith",
        email: "bob@example.com",
        phone: "4183456789",
        password: "Password123!",
      },
      {
        _id: userIds[3],
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie@example.com",
        phone: "5814567890",
        password: "Password123!",
      },
      {
        _id: userIds[4],
        firstName: "Diana",
        lastName: "Davis",
        email: "diana@example.com",
        phone: "5815678901",
        password: "Password123!",
      },
      {
        _id: userIds[5],
        firstName: "Eve",
        lastName: "Wilson",
        email: "eve@example.com",
        phone: "4186789012",
        password: "Password123!",
      },
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    // Create campsites of different types (noms en français, secteurs/zones du camping)
    const campsites = [
      {
        _id: campsiteIds[0],
        name: "Emplacement tente Lac A",
        location: "Secteur Lac - Rive nord",
        description:
          "Bel emplacement pour tente au bord du lac avec vue sur les montagnes",
        type: "tente",
        pricePerNight: 35,
        capacity: 4,
        amenities: ["eau", "feu de camp", "table de pique-nique"],
      },
      {
        _id: campsiteIds[1],
        name: "Emplacement tente Lac B",
        location: "Secteur Lac - Rive sud",
        description: "Emplacement de tente isolé, idéal pour les familles",
        type: "tente",
        pricePerNight: 40,
        capacity: 6,
        amenities: [
          "eau",
          "électricité",
          "feu de camp",
          "table de pique-nique",
        ],
      },
      {
        _id: campsiteIds[2],
        name: "RV Paradis Deluxe",
        location: "Secteur RV - Plateau central",
        description:
          "Emplacement RV haut de gamme avec tous les services et accès au lac",
        type: "rv",
        pricePerNight: 75,
        capacity: 2,
        maxVehicleLength: 18,
        amenities: [
          "électricité",
          "eau",
          "égout",
          "wifi",
          "douche",
          "toilettes",
        ],
      },
      {
        _id: campsiteIds[3],
        name: "Emplacement RV Écono",
        location: "Secteur RV - Entrée du camping",
        description: "Emplacement RV abordable avec services de base",
        type: "rv",
        pricePerNight: 55,
        capacity: 2,
        maxVehicleLength: 12,
        amenities: ["électricité", "eau", "égout", "table de pique-nique"],
      },
      {
        _id: campsiteIds[4],
        name: "Chalet Montagne Prestige",
        location: "Secteur Chalets - Belvédère",
        description: "Chalet de luxe avec vue panoramique sur les montagnes",
        type: "chalet",
        pricePerNight: 150,
        capacity: 8,
        amenities: [
          "électricité",
          "eau",
          "wifi",
          "douche",
          "toilettes",
          "feu de camp",
        ],
      },
      {
        _id: campsiteIds[5],
        name: "Chalet Forêt Boréale",
        location: "Secteur Chalets - Forêt boréale",
        description: "Chalet chaleureux entouré de pins et d’épinette noire",
        type: "chalet",
        pricePerNight: 110,
        capacity: 4,
        amenities: [
          "électricité",
          "eau",
          "feu de camp",
          "table de pique-nique",
        ],
      },
      {
        _id: campsiteIds[6],
        name: "Tente prêt-à-camper",
        location: "Secteur Prêt-à-camper - Prairie",
        description: "Expérience de glamping de luxe avec lits confortables",
        type: "glamping",
        pricePerNight: 120,
        capacity: 2,
        amenities: ["électricité", "eau", "wifi", "douche", "toilettes"],
      },
      {
        _id: campsiteIds[7],
        name: "Site de randonnée sauvage",
        location: "Secteur Arrière-pays - Sentier sauvage",
        description: "Emplacement rustique et isolé pour campeurs aventuriers",
        type: "arrière-pays",
        pricePerNight: 20,
        capacity: 2,
        amenities: ["abri", "feu de camp"],
      },
      {
        _id: campsiteIds[8],
        name: "Emplacement RV Premium",
        location: "Secteur RV - Vue panoramique",
        description:
          "Emplacement RV premium avec vue sur le lac et services complets",
        type: "rv",
        pricePerNight: 85,
        capacity: 4,
        maxVehicleLength: 20,
        amenities: [
          "électricité",
          "eau",
          "égout",
          "wifi",
          "douche",
          "toilettes",
          "feu de camp",
        ],
      },
    ];

    for (const campsiteData of campsites) {
      const campsite = new Campsite(campsiteData);
      await campsite.save();
    }

    // Create reservations for summer 2026
    const reservations = [
      // July reservations
      {
        _id: reservationIds[0],
        user: userIds[0],
        campsite: campsiteIds[0],
        startDate: "2026-07-01",
        endDate: "2026-07-03",
        guests: 2,
      },
      {
        _id: reservationIds[1],
        user: userIds[1],
        campsite: campsiteIds[1],
        startDate: "2026-07-05",
        endDate: "2026-07-08",
        guests: 4,
      },
      {
        _id: reservationIds[2],
        user: userIds[2],
        campsite: campsiteIds[2],
        startDate: "2026-07-10",
        endDate: "2026-07-12",
        guests: 2,
        vehicleLength: 16,
      },
      {
        _id: reservationIds[3],
        user: userIds[3],
        campsite: campsiteIds[3],
        startDate: "2026-07-15",
        endDate: "2026-07-17",
        guests: 2,
        vehicleLength: 10,
      },
      {
        _id: reservationIds[4],
        user: userIds[4],
        campsite: campsiteIds[4],
        startDate: "2026-07-20",
        endDate: "2026-07-25",
        guests: 6,
      },

      // August reservations
      {
        _id: reservationIds[5],
        user: userIds[0],
        campsite: campsiteIds[5],
        startDate: "2026-08-01",
        endDate: "2026-08-04",
        guests: 4,
      },
      {
        _id: reservationIds[6],
        user: userIds[1],
        campsite: campsiteIds[6],
        startDate: "2026-08-08",
        endDate: "2026-08-10",
        guests: 2,
      },
      {
        _id: reservationIds[7],
        user: userIds[2],
        campsite: campsiteIds[7],
        startDate: "2026-08-12",
        endDate: "2026-08-14",
        guests: 2,
      },
      {
        _id: reservationIds[8],
        user: userIds[3],
        campsite: campsiteIds[0],
        startDate: "2026-08-18",
        endDate: "2026-08-20",
        guests: 3,
      },
      {
        _id: reservationIds[9],
        user: userIds[4],
        campsite: campsiteIds[2],
        startDate: "2026-08-25",
        endDate: "2026-08-28",
        guests: 2,
        vehicleLength: 16,
      },

      // Additional reservations for variety
      {
        _id: reservationIds[10],
        user: userIds[0],
        campsite: campsiteIds[3],
        startDate: "2026-07-28",
        endDate: "2026-07-30",
        guests: 2,
        vehicleLength: 10,
      },
      {
        _id: reservationIds[11],
        user: userIds[1],
        campsite: campsiteIds[5],
        startDate: "2026-08-15",
        endDate: "2026-08-17",
        guests: 4,
      },

      // User1 reservations with different statuses for testing
      {
        _id: reservationIds[12],
        user: userIds[1],
        campsite: campsiteIds[7],
        startDate: "2026-09-01",
        endDate: "2026-09-03",
        guests: 2,
        status: "confirmed",
      },
      {
        _id: reservationIds[13],
        user: userIds[1],
        campsite: campsiteIds[8],
        startDate: "2026-09-05",
        endDate: "2026-09-07",
        guests: 3,
        vehicleLength: 18,
        status: "cancelled",
      },
    ];

    for (const resData of reservations) {
      const campsite = campsites.find((c) => c._id.equals(resData.campsite));
      const days = Math.ceil(
        (new Date(resData.endDate) - new Date(resData.startDate)) /
          (1000 * 60 * 60 * 24),
      );
      const totalPrice = days * campsite.pricePerNight;

      const reservation = new Reservation({
        ...resData,
        totalPrice,
      });
      await reservation.save();
    }

    res
      .status(200)
      .json({
        message:
          "Database seeded successfully with users, campsites, and reservations",
      });
  } catch (e) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: e.message });
  }
};

module.exports = { seedDatabase };
