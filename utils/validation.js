const { z } = require('zod');
const mongoose = require('mongoose')
const AppError = require("./appError")
const catchAsync = require('./catchAsync');

  


exports.itemValidationCreate  = async function (req, res, next) {
    const itemValidationSchema = z.object({
        name: z.string().trim().min(1, 'Name for an item is required').max(50, 'Name must have less than or equal to 50 characters'),
        description: z.string().trim().min(1, 'Description is required').max(500, 'Description must have less than or equal to 500 characters'),
        category: z.enum(['Shirts', 'Pants', 'Jackets', 'Shoes', 'Accessories', 'Other'], 'Invalid category'),
        size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'], 'Invalid size'),
        condition: z.enum(['New', 'Like New', 'Good', 'Worn'], 'Invalid condition'),
        location: z.object({
          type: z.literal('Point'),
          coordinates: z
            .array(z.number().min(-180).max(180)) // Validate longitude and latitude range
            .length(2, 'Coordinates must be [longitude, latitude]'),
        }).optional(),
        images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
        actualPrice: z.number().positive('Actual price must be a positive number'),
        isAvailable: z.boolean().optional().default(true),
        views: z.number().int().nonnegative().optional().default(0),
      });
    
    try {
      await itemValidationSchema.parseAsync(req.body);
      next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map((zodError) => ({
              path: zodError.path.join('.'),
              message: zodError.message,
            }));
            // console.log(errors );
            // console.log( "----------\n");  
            // console.log(error);
            next(new AppError('Validation failed', 400,errors));
          } else {
            next(error);
          }
    }
  }

  exports.itemValidationUpdate = async function (req, res, next) {
    const itemValidationSchema = z.object({
      name: z.string().trim().min(1, 'Name for an item is required').max(50, 'Name must have less than or equal to 50 characters'),
      description: z.string().trim().min(1, 'Description is required').max(500, 'Description must have less than or equal to 500 characters'),
      category: z.enum(['Shirts', 'Pants', 'Jackets', 'Shoes', 'Accessories', 'Other'], 'Invalid category'),
      size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'], 'Invalid size'),
      condition: z.enum(['New', 'Like New', 'Good', 'Worn'], 'Invalid condition'),
      location: z.object({
        type: z.literal('Point'),
        coordinates: z
          .array(z.number().min(-180).max(180)) // Validate longitude and latitude range
          .length(2, 'Coordinates must be [longitude, latitude]'),
      }).optional(),
      images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
      actualPrice: z.number().positive('Actual price must be a positive number'),
      isAvailable: z.boolean().optional().default(true),
      views: z.number().int().nonnegative().optional().default(0),
    });
  
    // Create a partial schema for updates
    const updateSchema = itemValidationSchema.partial();
  
    try {
      await updateSchema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((zodError) => ({
          path: zodError.path.join('.'),
          message: zodError.message,
        }));
        next(new AppError('Validation failed', 400, errors ));
      } else {
        next(error);
      }
    }
  };
  exports.validateParam = (paramNames) => {
    return (req, res, next) => {
      // Loop through each param name and check if it exists
      for (let paramName of paramNames) {
        const paramValue = req.params[paramName];
  
        if (paramValue && !mongoose.Types.ObjectId.isValid(paramValue)) {
          return next(new AppError(`Invalid ${paramName} format`, 400));
        }
      }
  
      next();
    };
  };