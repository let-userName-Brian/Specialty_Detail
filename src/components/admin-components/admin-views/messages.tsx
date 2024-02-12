import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { renderLoading } from "../../../helpers/loading-skeletons";
import {
  getDatabase,
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
  startAfter,
} from "firebase/database";
import { firebase } from "../../../config/firebase";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../sub-components/schedule-form";
import { debounce } from "lodash";

type GroupedMessages = {
  [monthYear: string]: Message[];
};

export default function Messages() {
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<null | string>(null);
  const [messages, setMessages] = useState<GroupedMessages>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [lastKey, setLastKey] = useState<string | null>(null);
  const messageBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      debounceFetchMessages(searchTerm);
    } else {
      fetchMessages().catch((error) => {
        setLoadingError(error.message);
      });
    }

    return () => {
      debounceFetchMessages.cancel();
    };
  }, [searchTerm]);

  const debounceFetchMessages = debounce((search) => {
    fetchMessages(null, search).catch((error) => {
      setLoadingError(error.message);
    });
  }, 500);

  const fetchMessages = async (
    lastKey: string | null = null,
    search: string = ""
  ) => {
    setLoading(true);
    const database = getDatabase(firebase);
    let messagesQuery;

    if (lastKey) {
      messagesQuery = query(
        ref(database, "/messages"),
        orderByChild("receivedDate"),
        startAfter(lastKey),
        limitToLast(10)
      );
    } else {
      messagesQuery = query(
        ref(database, "/messages"),
        orderByChild("receivedDate"),
        limitToLast(10)
      );
    }

    onValue(
      messagesQuery,
      (snapshot) => {
        const data = snapshot.val();
        let messagesArray: Message[] = [];
        if (data) {
          const keys = Object.keys(data);
          messagesArray = Object.values(data) as Message[];

          if (search) {
            messagesArray = messagesArray.filter(
              (message: Message) =>
                message.name.toLowerCase().includes(search.toLowerCase()) ||
                message.number.toLowerCase().includes(search.toLowerCase()) ||
                message.email.toLowerCase().includes(search.toLowerCase()) ||
                message.service.toLowerCase().includes(search.toLowerCase()) ||
                message.date.toLowerCase().includes(search.toLowerCase())
            );
          }

          const groupedMessages = groupMessagesByMonthYear(messagesArray);
          setMessages(groupedMessages);
          setLastKey(keys[0]);
        } else {
          setMessages({});
        }

        if (loadingError) setLoadingError(null);
        setLoading(false);
      },
      {
        onlyOnce: true,
      }
    );
  };

  const groupMessagesByMonthYear = (messages: Message[]): GroupedMessages => {
    return messages.reduce<GroupedMessages>((acc, message) => {
      const date = new Date(message.receivedDate);
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthYear = `${
        monthNames[date.getMonth()]
      } / ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }

      acc[monthYear].push(message);
      return acc;
    }, {});
  };

  const handleScroll = () => {
    if (!messageBoxRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messageBoxRef.current;
    if (scrollHeight - scrollTop <= clientHeight * 1.1) fetchMessages(lastKey);
  };

  return (
    <StyledMessageWrapper>
      <StyledContentBox>
        <StyledCard onScroll={handleScroll} ref={messageBoxRef}>
          <StyledTitleBox>
            <StyledCardTitle>Messages</StyledCardTitle>
            <StyledTextField
              label="Search by name, phone, email, service, date"
              variant="outlined"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </StyledTitleBox>
          {loading && renderLoading()}
          {loadingError && (
            <StyledNoContentBox>
              <StyledErrorMessage>{loadingError}</StyledErrorMessage>
            </StyledNoContentBox>
          )}
          <StyledCardContentBox>
            {Object.keys(messages).length > 0 &&
              !loading &&
              !loadingError &&
              Object.entries(messages).map(([monthYear, messages]) => (
                <section key={monthYear}>
                  <StyledMonth>{monthYear}</StyledMonth>
                  {messages.map((message, index) => (
                    <StyledMessageCard key={index}>
                      <StyledCardContent>
                        <StyledName>{message.name}</StyledName>
                        <StyledPair>
                          <StyledLabel>Phone:</StyledLabel>
                          <StyledValue>{message.number}</StyledValue>
                        </StyledPair>
                        <StyledPair>
                          <StyledLabel>Email:</StyledLabel>
                          <StyledValue>{message.email}</StyledValue>
                        </StyledPair>
                        <StyledRequestBox>
                          <StyledValue sx={{ textAlign: "center" }}>
                            What / When:
                          </StyledValue>
                          <StyledPair>
                            <StyledLabel>Service:</StyledLabel>
                            <StyledValue>{message.service}</StyledValue>
                          </StyledPair>
                          <StyledPair>
                            <StyledLabel>Date:</StyledLabel>
                            <StyledValue>{message.date}</StyledValue>
                          </StyledPair>
                          <StyledPair>
                            <StyledLabel>Time:</StyledLabel>
                            <StyledValue>{message.time}</StyledValue>
                          </StyledPair>
                        </StyledRequestBox>
                        <StyledRequestBox>
                          <StyledValue sx={{ textAlign: "center" }}>
                            Where:
                          </StyledValue>
                          <StyledValue sx={{ textAlign: "center" }}>
                            {message.address.street}
                          </StyledValue>
                          <StyledValue sx={{ textAlign: "center" }}>
                            {message.address.city}, {message.address.zip}
                          </StyledValue>
                        </StyledRequestBox>
                      </StyledCardContent>
                    </StyledMessageCard>
                  ))}
                </section>
              ))}
          </StyledCardContentBox>
        </StyledCard>
      </StyledContentBox>
    </StyledMessageWrapper>
  );
}

const StyledMessageWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  width: "80vw",
  height: "85vh",
});

const StyledContentBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "3rem",
  flex: 1,
  width: "100%",
  height: "90%",
  overflow: "hidden",
  "@media (max-width: 900px)": {
    flexDirection: "column",
    alignItems: "center",
  },
});

const StyledCard = styled(Card)({
  padding: "2rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "3rem",
  width: "100%",
  height: "100%",
  color: "white",
  overflow: "auto",
  "@media (max-width: 900px)": {
    width: "80%",
    marginBottom: "1rem",
  },
  "@media (max-width: 600px)": {
    width: "100%",
  },
});

const StyledTitleBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  "@media (max-width: 600px)": {
    flexDirection: "column",
    marginBottom: "1rem",
  },
});

const StyledCardTitle = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  color: "white",
  "@media (max-width: 600px)": {
    textAlign: "center",
  },
});

const StyledNoContentBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  gap: "1rem",
});

const StyledErrorMessage = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
});

const StyledCardContentBox = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(23%, 1fr))",
  gridAutoRows: "minmax(350px, auto)",
  gap: "1rem",
  width: "100%",
  padding: "1rem",
  overflowY: "auto",
  "@media (max-width: 600px)": {
    gridTemplateColumns: "repeat(auto-fill, minmax(100%, 1fr))",
    padding: 0,
  },
});

const StyledMessageCard = styled(Card)({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "1rem",
  width: "100%",
  height: "auto",
  color: "white",
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  overflow: "auto",
  marginBottom: "1rem",
  "@media (max-width: 600px)": {
    width: "100%",
  },
});

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  height: "100%",
  padding: 0,
});

const StyledRequestBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  height: "100%",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "1rem",
  borderRadius: "1rem",
});

const StyledMonth = styled(Typography)({
  fontSize: "1rem",
  marginBottom: "1rem",
  color: "white",
  fontStyle: "italic",
});

const StyledPair = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "0 auto",
  width: "80%",
});

const StyledLabel = styled(Typography)({
  fontSize: "1rem",
  fontWeight: "bold",
  color: "white",
});

const StyledName = styled(Typography)({
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "white",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textAlign: "center",
  textOverflow: "ellipsis",
});

const StyledValue = styled(Typography)({
  fontSize: "1rem",
  color: "white",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const StyledTextField = styled(TextField)({
  width: "30%",
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(160,32,240)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  },
  "@media (max-width: 600px)": {
    width: "100%",
  },
});
