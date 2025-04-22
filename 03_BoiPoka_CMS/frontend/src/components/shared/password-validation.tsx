import { Input } from "@/components/ui/input";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface InputPasswordProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

// export default function PasswordWithValidation({ value, onChange }: InputPasswordProps) {
//   const [isVisible, setIsVisible] = useState(false);

//   const toggleVisibility = () => setIsVisible((prevState) => !prevState);

//   const checkStrength = (pass: string) => {
//     const requirements = [
//       { regex: /.{8,}/, text: "At least 8 characters" },
//       { regex: /[0-9]/, text: "At least 1 number" },
//       { regex: /[a-z]/, text: "At least 1 lowercase letter" },
//       { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
//     ];

//     return requirements.map((req) => ({
//       met: req.regex.test(pass),
//       text: req.text,
//     }));
//   };

//   const strength = checkStrength(value);

//   const strengthScore = useMemo(() => {
//     return strength.filter((req) => req.met).length;
//   }, [strength]);

//   const getStrengthColor = (score: number) => {
//     if (score === 0) return "bg-border";
//     if (score <= 1) return "bg-red-500";
//     if (score <= 2) return "bg-orange-500";
//     if (score === 3) return "bg-amber-500";
//     return "bg-emerald-500";
//   };

//   const getStrengthText = (score: number) => {
//     if (score === 0) return "Enter a password";
//     if (score <= 2) return "Weak password";
//     if (score === 3) return "Medium password";
//     return "Strong password";
//   };

//   return (
//     <div>
//       <div className="space-y-2">
//         <div className="relative">
//           <Input
//             id="password"
//             className="pe-9"
//             placeholder="Password"
//             type={isVisible ? "text" : "password"}
//             value={value}
//             onChange={onChange}
//             aria-invalid={strengthScore < 4}
//             aria-describedby="password-strength"
//           />
//           <button
//             className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
//             type="button"
//             onClick={toggleVisibility}
//             aria-label={isVisible ? "Hide password" : "Show password"}
//             aria-pressed={isVisible}
//           >
//             {isVisible ? (
//               <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
//             ) : (
//               <Eye size={16} strokeWidth={2} aria-hidden="true" />
//             )}
//           </button>
//         </div>
//       </div>

//       <div
//         className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
//         role="progressbar"
//         aria-valuenow={strengthScore}
//         aria-valuemin={0}
//         aria-valuemax={4}
//         aria-label="Password strength"
//       >
//         <div
//           className={`h-full ${getStrengthColor(
//             strengthScore
//           )} transition-all duration-500 ease-out`}
//           style={{ width: `${(strengthScore / 4) * 100}%` }}
//         ></div>
//       </div>

//       <p
//         id="password-strength"
//         className="mb-2 text-sm font-medium text-foreground"
//       >
//         {getStrengthText(strengthScore)}
//       </p>

//       <ul className="grid grid-cols-2 gap-2" aria-label="Password requirements">
//         {strength.map((req, index) => (
//           <li key={index} className="flex items-center gap-2">
//         {req.met ? (
//           <Check
//             size={16}
//             className="text-emerald-500"
//             aria-hidden="true"
//           />
//         ) : (
//           <X
//             size={16}
//             className="text-muted-foreground/80"
//             aria-hidden="true"
//           />
//         )}
//         <span
//           className={`text-xs ${
//             req.met ? "text-emerald-600" : "text-muted-foreground"
//           }`}
//         >
//           {req.text}
//           <span className="sr-only">
//             {req.met ? " - Requirement met" : " - Requirement not met"}
//           </span>
//         </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export default function InputPassword({
  value,
  onChange,
  error,
}: InputPasswordProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id="input-password"
          className={cn("pe-9 text-sm md:text-base", error && "border-red-500")}
          placeholder="Password"
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
