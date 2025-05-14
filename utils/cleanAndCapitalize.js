export default function cleanAndCapitalize(input) {
  return input
    .trim() // Remove leading and trailing spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .toLowerCase() // Convert the entire string to lowercase
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join back into a single string
}
