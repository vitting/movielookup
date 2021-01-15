import csv from "csvtojson";
import path from "path";
import colors from "colors";
import { db, MovieModel } from "./db";
import { Movie } from "./interfaces/movie";

(async function () {
  await MovieModel.drop();
  await db.sync();

  const pathToCsv = path.join(
    path.join(__dirname, "..", "dataset", "movies_data.csv")
  );

  try {
    console.log(colors.black.bgGreen("Import started"));
    const data = await csv().fromFile(pathToCsv);

    const dbData: Movie[] = data.map<Movie>((movie) => {
      let runtimeText = movie.Runtime as string;
      const runtime = parseInt(runtimeText.split(" ")[0]) || 0;

      
      
      return {
        title: movie.Title as string,
        country: movie.Country as string,
        director: movie.Director as string,
        genre: movie.Genre as string,
        language: movie.Language as string,
        posterUrl: movie.Poster as string,
        year: movie.Year as number,
        runtime,
        actors: movie.Actors as string,
        plot: movie.Plot as string,
        averageRating: 0
      };
    });

    await MovieModel.bulkCreate(dbData);
    console.log(
      colors.black.bgGreen("Import ended. Elements importet: " + dbData.length)
    );
  } catch (error) {
    console.error(error);
  }
})();
