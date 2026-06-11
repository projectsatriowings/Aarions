import Address from "../models/Address.js";
import User from "../models/User.js";
import { ErrorResponse } from "../middleware/errorHandler.js";

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort("-isDefault -createdAt");
    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  const { street, city, state, postalCode, country, phone, isDefault } = req.body;

  try {
    const addressesCount = await Address.countDocuments({ user: req.user.id });

    // Force default if it's the user's first address
    const defaultFlag = addressesCount === 0 ? true : !!isDefault;

    const address = await Address.create({
      user: req.user.id,
      street,
      city,
      state,
      postalCode,
      country: country || "India",
      phone,
      isDefault: defaultFlag,
    });

    // Link Address to User collection
    await User.findByIdAndUpdate(req.user.id, {
      $push: { addresses: address._id },
    });

    const addresses = await Address.find({ user: req.user.id }).sort("-isDefault -createdAt");

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
      addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set address as default
// @route   PUT /api/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.id });

    if (!address) {
      return next(new ErrorResponse("Address not found", 404));
    }

    address.isDefault = true;
    await address.save(); // Save hook handles toggling others off

    const addresses = await Address.find({ user: req.user.id }).sort("-isDefault -createdAt");

    res.status(200).json({
      success: true,
      message: "Default address updated",
      addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.id });

    if (!address) {
      return next(new ErrorResponse("Address not found", 404));
    }

    await Address.findByIdAndDelete(req.params.id);

    // Unlink from User collection
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { addresses: req.params.id },
    });

    // If deleted address was default, set another address as default if list not empty
    if (address.isDefault) {
      const anotherAddress = await Address.findOne({ user: req.user.id });
      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
