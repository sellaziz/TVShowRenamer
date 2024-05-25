const cleanFileName = (name: string): string => {
    const unnecessaryDetails = /(VOSTFR|ENG|VOSTA|FRENCH|720p|1080p|\[.*?\])/gi;
    return name.replace(unnecessaryDetails, '').trim();
  };

  export default cleanFileName;
