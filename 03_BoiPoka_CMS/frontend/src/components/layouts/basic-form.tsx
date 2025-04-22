import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputPassword from "@/components/shared/password-validation";
import NumberInputWithSign from "../shared/form-inputs/number-input";
import PhoneNumberWithFlag from "../shared/form-inputs/phone-number";
import HorizontalRadioGroup from "../shared/form-inputs/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SelectWithSearch from "../shared/form-inputs/select-with-search";
import { Checkbox } from "../ui/checkbox";
import Rating from "../shared/form-inputs/rating";
import UploadProfile from "../shared/form-inputs/upload-profile";
import SimpleDatePicker from "../shared/form-inputs/date-and-time/simple-date";
import DateRangePickerComp from "../shared/form-inputs/date-and-time/date-range-picker";
import SimpleDateInput from "../shared/form-inputs/date-and-time/date-input";
import SimpleTimeInput from "../shared/form-inputs/date-and-time/time-input";
import DateTimeInput from "../shared/form-inputs/date-and-time/date-time-input";
import { Textarea } from "../ui/textarea";
import LimitedCharTextArea from "../shared/form-inputs/textarea-with-char";
import ExperienceRatingSlider from "../shared/form-inputs/sliders/experience-rating";
import PriceFilter from "../shared/form-inputs/sliders/price-filter";
import BasicOtp from "../shared/form-inputs/basic-otp";
import BankCard from "../shared/form-inputs/bank-card";
import InputInnerTags from "../shared/form-inputs/input-inner-tags";

const FormComponent = () => {
  const { toast } = useToast();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      console.log("User added successfully", data);
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error) {
      console.error("Failed to add user", error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const onClear = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col mx-auto items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Form Component
            </CardTitle>
            <CardDescription className="text-gray-600">
              All Types of Input
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Personal Details */}
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-xl font-semibold">Personal Details</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name (Basic Text)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="User Name"
                  {...register("name")}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email (Required)<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user-email@example.com"
                  {...register("email")}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password(Show/Hide)</Label>
                <InputPassword
                  value={watch("password") || ""}
                  onChange={(e) => setValue("password", e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Phone Number with Flag</Label>
                <PhoneNumberWithFlag />
                {/* {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )} */}
              </div>
              <div className="space-y-2">
                <Label>Website (Input with start-addon)</Label>
                <div className="flex rounded-lg shadow-sm shadow-black/5">
                  <span className=" inline-flex items-center rounded-s-lg border border-input px-3 text-sm text-muted-foreground ">
                    https://
                  </span>
                  <Input
                    className="-ms-px rounded-s-none shadow-none"
                    placeholder="digitalsalt.in"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Select with left text</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <span>
                      Role: <SelectValue placeholder="Select a Role" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">User</SelectItem>
                    <SelectItem value="2">Admin</SelectItem>
                    <SelectItem value="3">SuperAdmin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 md:col-span-3 space-y-2 flex items-center gap-6">
                <legend className="text-sm font-medium leading-none text-foreground">
                  Gender
                </legend>
                <HorizontalRadioGroup />
              </div>
              <div className="col-span-1 md:col-span-3 space-y-2 flex items-center gap-6">
                <legend className="text-sm font-medium leading-none text-foreground">
                  Hobbies
                </legend>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <Label>Coding</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <Label>Traveling</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <Label>Cooking</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <Label>Sports</Label>
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="bio">Bio (Simple TextArea)</Label>
                <Textarea id="bio" placeholder="Leave a comment" />
                <p
                  className="mt-2 text-xs text-muted-foreground"
                  role="region"
                  aria-live="polite"
                >
                  Please add as many details as you can
                </p>
              </div>
              <div className="col-span-1 space-y-2">
                <Label htmlFor="tweet">Tweet (With Char Limit)</Label>
                <LimitedCharTextArea />
              </div>

              {/* Communication Details */}
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-xl font-semibold">Communication Details</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">
                  Country (Select with Search)
                </Label>
                <SelectWithSearch />
              </div>
              <div className="space-y-2">
                <Label>State (Simple Select)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Maharastra" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="uttarpradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="westbengal">West Bengal</SelectItem>
                    <SelectItem value="bihar">Bihar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="text"
                  placeholder="User Mobile Number"
                  {...register("mobileNumber")}
                  required
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="User Location"
                  {...register("location")}
                  required
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Banking Details */}
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-xl font-semibold">Date and Time</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateInput">Simple Date Input</Label>
                <SimpleDateInput />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datePicker">DOB (Simple Date Picker)</Label>
                <SimpleDatePicker />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeInput">Simple Time Input with Icon</Label>
                <SimpleTimeInput />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateAndTime">Date and Time Input</Label>
                <DateTimeInput />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2 w-2/3">
                <Label htmlFor="dateRangePicker">Date Range Picker</Label>
                <DateRangePickerComp />
              </div>
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-xl font-semibold">Banking Details</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="Bank Name"
                  {...register("bankName")}
                  required
                />
                {errors.bankName && (
                  <p className="text-red-500 text-sm">
                    {errors.bankName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Account Number"
                  {...register("accountNumber")}
                  required
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  type="text"
                  placeholder="IFSC Code"
                  {...register("ifscCode")}
                  required
                />
                {errors.ifscCode && (
                  <p className="text-red-500 text-sm">
                    {errors.ifscCode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Credit/Debit Card Details</Label>
                <BankCard />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileInput">File Input</Label>
                <Input
                  id="fileInput"
                  className="p-0 pe-3 file:me-3 file:border-0 file:border-e file:bg-gray-100 file:py-2 file:px-4 file:rounded file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                  type="file"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Profile</Label>
                <UploadProfile />
              </div>
              <div className="space-y-2">
                <Label>Basic OTP (Spaced)</Label>
                <BasicOtp />
              </div>
              <div className="space-y-2">
                <Label>Input with Inner Tags</Label>
                <InputInnerTags />
              </div>

              {/* Other Input */}
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-xl font-semibold">Other Input Fields</h2>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Number (Inc/Dec)</Label>
                <NumberInputWithSign />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Rating />
              </div>

              <div className="space-y-2">
                <ExperienceRatingSlider />
              </div>
              <div className="space-y-2">
                <PriceFilter />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <Button
                type="button"
                onClick={onClear}
                className="w-full md:w-auto"
              >
                Clear
              </Button>
              <Button type="submit" className="w-full md:w-auto">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default FormComponent;
