import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const skip = searchParams.get('skip');
    const limit = searchParams.get('limit');
    const query = searchParams.get('query');
  try {
    const response = await fetch(`https://november7-730026606190.europe-west1.run.app/movies/?skip=${skip}&limit=${limit}&query=${query}`);
    const movies = await response.json();  // Parse the response into JSON
    
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    return NextResponse.json(movies, { status: 200 }); // Send the movie list directly in the response
  } catch (error) {
    console.error("Error fetching movies:", error);
    return new Response('Error fetching movies', { status: 500 });
  }
}