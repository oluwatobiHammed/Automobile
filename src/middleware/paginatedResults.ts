import { BadRequestError, NotAuthorizedError } from '@sgtickets/common';
import { NextFunction, Request, Response }  from 'express';
import { makeValid } from '../events/types/isValid';


interface Results {
  next: Result;
  previous: Result;
  results: any;
}

interface Match {
  make: string;
  year: number;
  userId?: string;
}

interface Matches {
  make: string;
  year: number;
}

interface Result {
  page: number;
  limit: number;
}

declare global {
  namespace Express {
    interface Response {
      paginatedResults?: Results;
    }
  }
}

export const  paginatedResults = (model:any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const updates = Object.keys(req.query)
    const allowedUpdates = [ 'make', 'color','price','year', 'condition','bodyStyles', 'transmission','page', 'limit']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  
    if (!isValidOperation) {
      throw new BadRequestError('Invalid Query');
  }


  
  
  if (!req.query){
    throw new BadRequestError('Invalid Query');
  }
  const { page, limit, year, make } = req.query
     const match = {} as Match
     const matches = {} as Matches
    const limits  = limit ? +limit : 10
    const pages = page ? +page!  : 1

    
   
   match.userId = req.params.id
    
     
     if (year) {
    match.year = parseInt(year.toString())
    matches.year = parseInt(year.toString())
  }
 
  if (make) {
    if (makeValid(make.toString())) {
      match.make = make.toString()
      matches.make = make.toString()
    } 
}
   
    const startIndex = (pages - 1) * limits
    const endIndex = pages * limits

    const results = {} as Results

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: pages + 1,
        limit: limits
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: pages - 1,
        limit: limits
      }
    }
    if (match.userId !== undefined) {
      try {
        results.results = await model.find(match)
        .limit(limits)
        .skip(startIndex)
        .exec()
        res.paginatedResults = results
        next()
      } catch (e) {
        throw new BadRequestError(e.message );
        
      }
     }
    
    try {
      results.results = await model.find(matches)
      .limit(limits)
      .skip(startIndex)
      .exec()
      res.paginatedResults = results
      next()
    } catch (e) {
      throw new BadRequestError(e.message );
      
    }
  }
}