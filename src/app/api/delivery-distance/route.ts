import { NextResponse } from "next/server";

const BORDEAUX = {
  lat: 44.837789,
  lon: -0.57918,
};

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function POST(request: Request) {
  const { adresse, ville } = await request.json();

  if (!adresse || !ville) {
    return NextResponse.json(
      { message: "Adresse et ville obligatoires." },
      { status: 400 },
    );
  }

  if (ville.trim().toLowerCase() === "bordeaux") {
    return NextResponse.json({
      distanceKm: 0,
      deliveryFee: 0,
    });
  }

  const query = encodeURIComponent(`${adresse}, ${ville}, France`);

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
    {
      headers: {
        "User-Agent": "ViteEtGourmand/1.0",
      },
    },
  );

  const data = await response.json();

  if (!data.length) {
    return NextResponse.json(
      { message: "Adresse introuvable." },
      { status: 404 },
    );
  }

  const lat = Number(data[0].lat);
  const lon = Number(data[0].lon);

  const distanceKm = getDistanceKm(BORDEAUX.lat, BORDEAUX.lon, lat, lon);

  const deliveryFee = 5 + distanceKm * 0.59;

  return NextResponse.json({
    distanceKm: Number(distanceKm.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
  });
}
