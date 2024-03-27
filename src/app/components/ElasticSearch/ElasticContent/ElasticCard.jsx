import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { ElasticSearchContext } from "@/app/contexts/ElasticSearchContext";
import { motion } from "framer-motion";
import {
  descriptionField,
  displayFields,
  titleFields,
} from "@/app/filterFields";

export function ElasticCard({ data }) {
  const { search } = useContext(ElasticSearchContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const checkOverflow = () => {
      setIsOverflowing(ref.current.scrollHeight > ref.current.offsetHeight);
    };
    const timeoutId = setTimeout(checkOverflow, 0);
    return () => clearTimeout(timeoutId);
  }, [data]);
  // const searchWords = search.split(" ");
  // const regex = new RegExp(`(${searchWords.join("|")})`, "gi");
  //
  // const highlightedText = data[descriptionField].split(regex).map((part, i) =>
  //       searchWords.includes(part.toLowerCase()) && part !== "" ? (
  //             <span key={i} style={{ backgroundColor: "yellow" }}>
  //       {part}
  //     </span>
  //       ) : (
  //             part
  //       ),
  // );
  const highlightedText = data[descriptionField]
    .split(new RegExp(`(${search})`, "gi"))
    .map((part, i) =>
      part.toLowerCase() === search.toLowerCase() && part !== "" ? (
        <span key={i} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  return (
    <Card sx={{ boxShadow: 3 }} className={"border border-gray-200"}>
      <CardContent>
        <Link className={"cursor-pointer"} href={data.url}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {data[titleFields]}
          </Typography>
        </Link>
        {displayFields.map((field) => {
          return (
            <DisplayData
              arrayOfData={data[field.arrayOfData]}
              name={field.uiName}
              extra={data[field.extra]}
              key={field.uiName}
            />
          );
        })}

        <Box
          ref={ref}
          component={motion.div}
          className={"max-h-fit"}
          initial={{ height: 150 }}
          animate={{ height: isExpanded ? "auto" : 150 }}
          overflow="hidden"
          position="relative"
        >
          <Typography variant="body1" color="text.secondary">
            {highlightedText}
          </Typography>
          {!isExpanded && isOverflowing && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2em",
                backgroundImage: "linear-gradient(to top, white, transparent)",
              }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {isOverflowing && (
            <Button
              variant="text"
              color="primary"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              Read {isExpanded ? "Less" : "More"}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export function DisplayData({ arrayOfData, extra, name }) {
  return (
    <Typography variant="body1" color="text.secondary" className={"mb-3"}>
      <span className={"font-bold"}>{name} </span>
      {arrayOfData.length === 0 ? (
        "None"
      ) : (
        <span>
          {arrayOfData.join(", ")} {extra && "- " + extra}
        </span>
      )}
    </Typography>
  );
}
