const truncateWord = (text: string, numberWord: number) => {
  const arrayWord = text.split(" ");

  arrayWord.length > numberWord &&
    arrayWord.splice(numberWord) &&
    arrayWord.push("...");

  if (arrayWord[0].length > 18) {
    return arrayWord[0].split("").slice(0, 18).join("") + "...";
  }

  return arrayWord.join(" ");
};

export { truncateWord };
