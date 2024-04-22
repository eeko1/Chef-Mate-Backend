import { Rating } from "@sharedTypes/DBTypes";
import { NextFunction } from "express";
import CustomError from "../../classes/CustomError";
import { fetchAllRatings, fetchAverageRatingByMediaId, fetchRatingsByMediaId } from "../models/ratingModel";
import { Request, Response } from "express";

const ratingListGet = async (
  req: Request,
  res: Response<Rating[]>,
  next: NextFunction
) => {
  try {
    const ratings = await fetchAllRatings();
    if (ratings) {
      res.json(ratings);
      return;
    }
    next(new CustomError('No ratings found', 404));
  } catch (error) {
    next(error);
  }
};

const ratingListByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<Rating[]>,
  next: NextFunction
) => {
  try {
    const ratings = await fetchRatingsByMediaId(Number(req.params.id));
    if (ratings) {
      res.json(ratings);
      return;
    }
    next(new CustomError('No ratings found', 404));
  } catch (error) {
    next(error);
  }
};

const ratingAverageByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<{average: number}>,
  next: NextFunction
) => {
  try {
    const average = await fetchAverageRatingByMediaId(Number(req.params.id));
    if (average) {
      res.json({average});
      return;
    }
    next(new CustomError('No ratings found', 404));
  } catch (error) {
    next(error);
  }
};

export {ratingListGet, ratingListByMediaIdGet, ratingAverageByMediaIdGet};
