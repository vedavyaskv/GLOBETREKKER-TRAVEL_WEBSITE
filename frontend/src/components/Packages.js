import React from 'react';

const packages = [
  {
    title: "Voyager Package",
    price: "₹ 9,999/-",
    img: "/twostar.jpg",
    features: [
      "2-Star Hotel",
      "5 Nights Stay",
      "Group Sightseeing Only",
      "Shared Airport Transfers",
      "Free Photo Session",
      "Friendly Tour Guide",
      "24/7 Customer Help Center"
    ]
  },
  {
    title: "Discoverer Package",
    price: "₹ 19,999/-",
    img: "/threestar.jpg",
    features: [
      "3-Star Hotel",
      "6 Nights Stay",
      "Guided Tours + Entry Tickets",
      "Shared + Some Private Transfers",
      "Free Photo Session",
      "Multilingual Tour Guide",
      "24/7 Customer Help Center"
    ]
  },
  {
    title: "Explorer Package",
    price: "₹ 29,999/-",
    img: "/fourstar.jpg",
    features: [
      "4-Star Hotel",
      "7 Nights Stay",
      "Guided + Adventure Activities",
      "Private Airport Transfers",
      "Drone Photo + Video Session",
      "Expert Tour Manager",
      "Priority Support Center"
    ]
  },
  {
    title: "Globetrotter Package",
    price: "₹ 39,999/-",
    img: "/fivestar.jpg",
    features: [
      "5-Star/Luxury Resort",
      "8 Nights Stay",
      "Custom Itinerary & VIP Experiences",
      "Limousine or Private Transfers",
      "Professional Photoshoot & Reel",
      "Personal Concierge & Guide",
      "Dedicated 24/7 Travel Manager"
    ]
  }
];

export default function Packages() {
  return (
    <section id="packages" style={{ background: "#f7f8fa", padding: "25px 0" }}>
      <h2 style={{
        textAlign: "center",
        color: "#07406e",
        fontSize: "2.7rem",
        fontWeight: 700,
        marginBottom: "40px"
      }}>
        Choose Your Perfect Package
      </h2>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "30px",
        justifyContent: "center",
        alignItems: "stretch",
        maxWidth: "1680px",
        margin: "0 auto",
        padding: "0 32px"
      }}>
        {packages.map(pkg => (
          <div
            key={pkg.title}
            style={{
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 8px 28px rgba(0,0,0,0.09)",
              width: "385px",
              minWidth: "320px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              position: "relative",
              width: "100%",
              height: "250px",
              background: "#eee",
              overflow: "hidden",
            }}>
              <img
                src={pkg.img}
                alt={pkg.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 15,
                  left: 15,
                  background: "#07406e",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1.16rem",
                  padding: "6px 21px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
                  zIndex: 2
                }}
              >
                {pkg.price}
              </span>
            </div>
            <div style={{ padding: "6px 20px 24px", flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
              <h3 style={{
                color: "#07406e",
                fontSize: "1.55rem",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: 16
              }}>
                {pkg.title}
              </h3>
              <ul style={{
                paddingLeft: 0,
                margin: 0,
                listStyle: "none",
                color: "#233c54",
                fontSize: "1.11rem",
                lineHeight: 1.69
              }}>
                {pkg.features.map((feat, idx) => (
                  <li key={idx} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 4,
                  }}>
                    <span style={{
                      fontSize: "1.2rem",
                      color: "#07406e",
                      marginRight: 8
                    }}>•</span>{feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
