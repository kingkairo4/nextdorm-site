// CircleSpaces / NextDorm — sample leaderboard data for the Flowers section.
// Replace the contents of window.NEXT_DORM_FLOWERS_DATA with a real API response
// in the same shape to go live: { people: [...], dorms: [...] }.
// Each entry needs name, count, and optional title; initials/avatar color are
// derived at render time in js/nextdorm-flowers.js.
(function () {
  "use strict";

  window.NEXT_DORM_FLOWERS_DATA = {
    people: [
      { name: "Kairo B.", title: "Big Bruno", count: 15 },
      { name: "Jenna L.", title: "Saint o’ the South", count: 13 },
      { name: "Alex T.", title: "Andrews Ace", count: 12 },
      { name: "Solomon P.", title: "James Mead Jewel", count: 10 },
      { name: "Johnray S.", title: "Champlin Champion", count: 9 },
      { name: "Jessica R.", title: "Buxton Beacon", count: 8 },
      { name: "Brandon H.", title: "Arch Bron Angel", count: 7 },
      { name: "Alexis N.", title: "Metcalf Maestro", count: 6 },
      { name: "Max C.", title: "Thayer Trailblazer", count: 5 },
      { name: "Lily Y.", title: "Lounge Legend", count: 4 }
    ],
    dorms: [
      { name: "Arch Bron", count: 64 },
      { name: "New Pembroke", count: 58 },
      { name: "James Mead", count: 51 },
      { name: "Danoff", count: 46 },
      { name: "Ev Pol", count: 41 },
      { name: "Morriss", count: 37 },
      { name: "Minden Hall", count: 32 },
      { name: "Emery-Woolley", count: 28 },
      { name: "Slater Hall", count: 24 },
      { name: "Sears House", count: 20 }
    ]
  };
})();
