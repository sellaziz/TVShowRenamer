import cleanFileName from './cleanFileName.ts';

interface ExtractedDetails {
  showName: string;
  seasonNumber: string;
  episodeNumber: string;
}

const extractDetails = (name: string): ExtractedDetails => {
  const cleanedName = cleanFileName(name);

  const seasonMatch = cleanedName.match(/(?:S|Season\s*)(\d{1,2})/i);
  const seasonNumber = seasonMatch ? seasonMatch[1].padStart(2, '0') : '01';

  const episodeMatch = cleanedName.match(/(?:E|Episode\s*)(\d{1,2})/i) || cleanedName.match(/(\d{1,2})/);
  const episodeNumber = episodeMatch ? episodeMatch[1].padStart(2, '0') : '00';

  let showName = cleanedName.replace(/(?:S|Season\s*)\d{1,2}/i, '')
                            .replace(/(?:E|Episode\s*)\d{1,2}/i, '')
                            .replace(/\d{1,2}/, '')
                            .replace(/\./g, ' ')
                            .trim();

  showName = showName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  if (!showName) {
    showName = 'Unknown Show';
  }

  return { showName, seasonNumber, episodeNumber };
};

export default extractDetails;
