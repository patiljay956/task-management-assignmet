import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, username, email, password } = req.body;
    console.log(name, username, email, password);
    if (
        [name, username, password, email].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const exsitedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (exsitedUser) {
        throw new ApiError(400, "username or email is already exists ");
    }

    const user = await User.create({
        name,
        username: username?.toLowerCase(),
        email,
        password,
    });

    const checkUserCreate = await User.findById(user._id).select("-password ");

    if (!checkUserCreate) {
        throw new ApiError(500, "Something Went wrong while creating a user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                checkUserCreate,
                "User has beens successfuly Created"
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError("Email or username field is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(401, "User Not found ");
    }

    const checkPasswordCorrect = await user.isPasswordCorrect(password);
    if (!checkPasswordCorrect) {
        throw new ApiError(401, "Incorrect Password");
    }

    const loggedInUser = await User.findById(user._id).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser },
                "user Logged In Successfully."
            )
        );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { email, currentPassword, newPassword, confirmNewPassword } =
        req.body;

    if (!(currentPassword || newPassword)) {
        throw new ApiError(400, "All fields must be requried");
    }

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(401, "Password does not match ");
    }
    if (!email) {
        throw new ApiError(400, "Email field must be requried");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "Unable to find the user");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: true });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, oldEmail, newEmail } = req.body;

    if (!(name, oldEmail, newEmail)) {
        throw new ApiError(400, "Fileds are requried to update");
    }

    try {
        const user = await User.findOneAndUpdate(
            { email: oldEmail },
            {
                name: name,
                email: newEmail,
            },
            { new: true }
        ).select("-password");

        if (!user) {
            throw new ApiError(
                500,
                "Something wnet Wrong while updating the data"
            );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, user, "Data has been updated successfully")
            );
    } catch (error) {
        throw new ApiError(500, "unable to update user info", error);
    }
});

export { registerUser, loginUser, changeCurrentPassword, updateAccountDetails };
