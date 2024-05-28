const cleanFileName = (name: string): string => {
  const unnecessaryDetails = /(VOSTFR|ENG|VOSTA|FRENCH|720p|1080p|HDRip|HDTV|HDTV|WEBRip|WEB-DL|WEBDL|WEB|HD\[.*?\])/gi;
  // remove unnecessary details case insensitively
  name = name.toLowerCase();
  // remove unnecessary details lowercase
  name = name.replace(unnecessaryDetails, '');
  //remove everything after '-' character if exist
  name = name.replace(/-.*$/g, '');
  // remove '-' character
  name = name.replace(/-/g, '');
  // remove everything between brackets
  name = name.replace(/\[(.*?)\]/g, '');
  // remove everything between parenthesis
  name = name.replace(/\((.*?)\)/g, '');
  // trim leading and trailing spaces
  name = name.trim();
  return name;
};

export default cleanFileName;
