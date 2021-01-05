import csv from "csvtojson";
import path from "path";
import { db, MovieModel } from "./db";
import { Movie } from "./interfaces/movie";

(async function () {
  await MovieModel.drop();
  await db.sync();

  const pathToCsv = path.join(
    path.join(__dirname, "..", "dataset", "movies_data.csv")
  );

  try {
    const data = await csv().fromFile(pathToCsv);

    const dbData: Movie[] = data.map<Movie>((movie) => {
      return {
        title: movie.Title as string,
        country: movie.Country as string,
        director: movie.Director as string,
        genre: movie.Genre as string,
        language: movie.Language as string,
        posterUrl: movie.Poster as string,
        year: movie.Year as number,
      };
    });
    
    await MovieModel.bulkCreate(dbData);
  } catch (error) {
    console.error(error);
  }
})();
