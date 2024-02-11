import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { logEventToGA } from "../../helpers/events";
import { Service } from "../../App";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import {
  DesktopDatePicker,
  DesktopTimePicker,
  MobileTimePicker,
} from "@mui/x-date-pickers";

export interface Form {
  name: string;
  email: string;
  number: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  date: string;
  time: string;
  service: string;
}

const initialFormState: Form = {
  name: "",
  email: "",
  number: "",
  address: {
    street: "",
    city: "",
    state: "GA",
    zip: "",
  },
  date: "",
  time: "",
  service: "Standard Wash",
};

const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

const formatPhoneNumber = (number: string): string => {
  // Format to (XXX) XXX-XXXX or similar logic as needed
  const cleaned = ("" + number).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return number;
};

const isFormValid = (form: Form): boolean => {
  return (
    form.name.trim() !== "" &&
    validateEmail(form.email) &&
    form.number.trim() !== "" &&
    form.address.street.trim() !== "" &&
    form.address.city.trim() !== "" &&
    form.address.zip.trim() !== "" &&
    form.date.trim() !== "" &&
    form.time.trim() !== "" &&
    form.service.trim() !== ""
  );
};

export default function ScheduleForm({
  currentServices,
}: {
  currentServices: Service[];
}) {
  const [formState, setFormState] = useState<Form>(initialFormState);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const handleSubmit = () => {
  //   logEventToGA("Schedule", "Submit", "Schedule Form Submitted");
  // };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string
  ) => {
    const { value } = e.target;
    let formattedValue = value;
    if (key.startsWith("address.")) {
      const addressKey = key.split(".")[1] as keyof Form["address"];
      if (addressKey) {
        const updatedAddress = {
          ...formState.address,
          [addressKey]: formattedValue,
        };
        setFormState((prevState) => ({
          ...prevState,
          address: updatedAddress,
        }));
      }
    } else {
      if (key === "number") {
        formattedValue = formatPhoneNumber(value);
      }
      setFormState((prevState) => ({ ...prevState, [key]: formattedValue }));
    }

    setIsSubmitEnabled(isFormValid(formState));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit logic here
    console.log(formState);
    logEventToGA("Schedule", "Submit", "Schedule Form Submitted");
  };

  return (
    <StyledFormWrapper>
      <StyledFormTitleBox>
        <StyledFormTitle>Let's get you on the books</StyledFormTitle>
      </StyledFormTitleBox>
      <StyledFormBox>
        <StyledField>
          <StyledGroupTitle>Contact Info</StyledGroupTitle>
          <StyledTextField
            variant="standard"
            label="Name"
            value={formState.name}
            onChange={(e) => handleInputChange(e, "name")}
            sx={{ width: "100%" }}
          />
          <StyledGroup>
            <StyledTextField
              variant="standard"
              label="Email"
              value={formState.email}
              onChange={(e) => handleInputChange(e, "email")}
            />
            <StyledTextField
              variant="standard"
              label="Phone Number"
              value={formState.number}
              onChange={(e) => handleInputChange(e, "number")}
            />
          </StyledGroup>
        </StyledField>

        <StyledField>
          <StyledGroupTitle>Address</StyledGroupTitle>
          <StyledTextField
            variant="standard"
            label="Street"
            sx={{ width: "100%" }}
            value={formState.address.street}
            onChange={(e) => handleInputChange(e, "address.street")}
          />
          <StyledGroup>
            <StyledTextField
              variant="standard"
              label="City"
              value={formState.address.city}
              onChange={(e) => handleInputChange(e, "address.city")}
            />
            <StyledTextField
              variant="standard"
              label="State"
              value={formState.address.state}
            />
            <StyledTextField
              variant="standard"
              label="Zip"
              value={formState.address.zip}
              onChange={(e) => handleInputChange(e, "address.zip")}
            />
          </StyledGroup>
        </StyledField>

        <StyledField>
          <StyledGroupTitle>When and which service?</StyledGroupTitle>
          <StyledGroup>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {isMobile ? (
                <StyledMobileDatePicker
                  label="What Day"
                  value={dayjs(formState.date) || dayjs()}
                  onChange={(newValue: any) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      date: newValue,
                    }));
                  }}
                />
              ) : (
                <StyledDesktopDatePicker
                  label="What Day"
                  value={dayjs(formState.date) || dayjs()}
                  onChange={(newValue: any) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      date: newValue,
                    }));
                  }}
                />
              )}
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {isMobile ? (
                <StyledMobileTimePicker
                  label="What Time"
                  value={dayjs(formState.time) || dayjs()}
                  onChange={(newValue: any) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      time: newValue,
                    }));
                  }}
                />
              ) : (
                <StyledDesktopTimePicker
                  label="What Time"
                  value={dayjs(formState.time) || dayjs()}
                  onChange={(newValue: any) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      time: newValue,
                    }));
                  }}
                />
              )}
            </LocalizationProvider>
          </StyledGroup>
          <StyledTextField
            variant="standard"
            select
            label="Service"
            sx={{ width: "100%" }}
            value={formState.service}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                service: e.target.value,
              }))
            }
          >
            {currentServices.map((option, index: number) => (
              <MenuItem key={index} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </StyledTextField>
        </StyledField>
        {!isSubmitEnabled ? (
          <Typography variant="caption" color="error">
            Please fill out all fields before submitting
          </Typography>
        ) : (
          <StyledButton variant="contained" onClick={handleSubmit}>
            Submit
          </StyledButton>
        )}
      </StyledFormBox>
    </StyledFormWrapper>
  );
}

const StyledFormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
  gap: "1rem",
  "@media (max-width: 600px)": {
    paddingBottom: "1.5rem",
  },
});

const StyledFormTitleBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
});

const StyledFormTitle = styled(Typography)({
  fontSize: "2rem",
  fontWeight: "bold",
  color: "white",
  textAlign: "center",
  "@media (max-width: 600px)": {
    fontSize: "1.5rem",
    paddingTop: "1rem",
    paddingBottom: "1rem",
  },
});

const StyledFormBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "95%",
  gap: "1rem",
  border: "1px solid white",
  backgroundColor: "rgba(0,0,0,0.5)",
  borderRadius: "2rem",
  padding: "2rem",
  "@media (max-width: 600px)": {
    width: "100%",
  },
});

const StyledField = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "90%",
  gap: "1rem",
  borderRadius: "2rem",
  padding: "1rem",
});

const StyledGroup = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  width: "100%",
  gap: "1rem",
});

const StyledGroupTitle = styled(Typography)({
  fontSize: "1rem",
  fontWeight: "bold",
  color: "white",
});

const StyledTextField = styled(TextField)({
  width: "80%",
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiInput-root": {
    "& input": {
      color: "white",
    },
    "& textarea": {
      color: "white",
    },
    "& select": {
      color: "white",
    },
    "&:before": {
      borderBottomColor: "white",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "white",
    },
    "&.Mui-focused:after": {
      borderBottomColor: "white",
    },
    "&.Mui-disabled": {
      "& .MuiInputBase-input": {
        color: "white", // Ensure disabled input text is white
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent", // Optional: if you want to hide the border
      },
    },
  },
  "& .MuiSelect-icon": {
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
    "&.Mui-disabled": {
      color: "white", // Ensure disabled label is white
    },
  },
});

const StyledButton = styled(Button)({
  width: "50%",
  height: "auto",
  borderRadius: "2rem",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(160,32,240)",
  },
  "@media (max-width: 600px)": {
    fontSize: "1rem",
  },
});

const StyledMobileDatePicker = styled(MobileDatePicker)({
  "& .MuiInputBase-root": {
    color: "white",
    borderColor: "white",
    "& .MuiSvgIcon-root": {
      fill: "white",
    },
  },
  "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
    color: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "& .MuiFormLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  },
});

const StyledDesktopDatePicker = styled(DesktopDatePicker)({
  "& .MuiInputBase-root": {
    color: "white",
    borderColor: "white",
    "& .MuiSvgIcon-root": {
      fill: "white",
    },
  },
  "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
    color: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "& .MuiFormLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  },
});

const StyledDesktopTimePicker = styled(DesktopTimePicker)({
  "& .MuiInputBase-root": {
    color: "white",
    borderColor: "white",
    "& .MuiSvgIcon-root": {
      fill: "white",
    },
  },
  "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
    color: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "& .MuiFormLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  },
});

const StyledMobileTimePicker = styled(MobileTimePicker)({
  "& .MuiInputBase-root": {
    color: "white",
    borderColor: "white",
    "& .MuiSvgIcon-root": {
      fill: "white",
    },
  },
  "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
    color: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "& .MuiFormLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  },
});
