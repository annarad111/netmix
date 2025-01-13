export const getMovies = async (params) => {
    // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(
      `/api/getMovies?skip=${params.skip}&limit=${params.limit}&query=${params.query}`,
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};
