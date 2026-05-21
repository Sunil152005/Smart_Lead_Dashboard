import { Request, Response } from "express";

import Lead from "../models/Lead";

export const createLead = async (
  req: Request,
  res: Response
) => {
  try {

    const lead =
      await Lead.create(req.body);

    res.json(lead);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      search,
      status,
      source,
      page = 1,
    } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {

      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const limit = 5;

    const skip =
      (Number(page) - 1) * limit;

    const leads = await Lead.find(query)
      .skip(skip)
      .limit(limit);

    const total =
      await Lead.countDocuments(query);

    res.json({
      leads,
      totalPages:
        Math.ceil(total / limit),
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response
) => {
  try {

    await Lead.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Lead Deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
};

export const updateLead = async (
  req: Request,
  res: Response
) => {
  try {

    const lead =
      await Lead.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(lead);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
};