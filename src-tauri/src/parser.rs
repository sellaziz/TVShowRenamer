use regex::Regex;
/// Takes the input an provide functions to handle it
use std::path::{Path, PathBuf};

use std::{
    fs,
    io::{self, Error},
};

fn get_filename(input: PathBuf) -> String {
    input
        .file_stem()
        .unwrap()
        .to_os_string()
        .into_string()
        .unwrap()
        .to_lowercase()
}

fn get_extension(input: PathBuf) -> String {
    input
        .extension()
        .unwrap()
        .to_os_string()
        .into_string()
        .unwrap()
        .to_lowercase()
}

fn extract_info(input: PathBuf) -> Option<[u32; 2]> {
    let info_set = vec![
        r"[Ss]([0-9]+)[ ._-]*[Ee]([0-9]+)",    // S03E04
        r"s([eai]+son\W?)?(\d{1,2})",          // Season 1
        r"[\-\s]?\W(\d{1,3})[\W\.]?",          // - 13
        r"(episode[s]?\W|\Wep\W|\W)(\d{1,3})", // Episode 1, Ep 1
    ];
    let info_reg: Vec<Regex> = info_set
        .into_iter()
        .map(|x| Regex::new(x).unwrap())
        .collect();
    let mut temp_txt = get_filename(input);
    if info_reg[0].is_match(&temp_txt) {
        let caps = info_reg[0].captures(&temp_txt).unwrap();
        let season = caps.get(1).map_or("", |m| m.as_str()).parse().unwrap();
        let episode = caps.get(2).map_or("", |m| m.as_str()).parse().unwrap();
        Some([season, episode])
    } else if info_reg[1].is_match(&temp_txt) {
        let caps = info_reg[1].captures(&temp_txt).unwrap();
        let season: u32 = caps.get(2).map_or("", |m| m.as_str()).parse().unwrap();
        temp_txt = info_reg[1]
            .replace(temp_txt.as_str(), "")
            .clone()
            .to_string();
        /* Season is found, let's check for an episode number */
        if info_reg[2].is_match(&temp_txt) {
            let caps = info_reg[2].captures(&temp_txt).unwrap();
            let episode: u32 = caps.get(1).map_or("", |m| m.as_str()).parse().unwrap();
            Some([season, episode])
        } else if info_reg[3].is_match(&temp_txt) {
            let caps = info_reg[3].captures(&temp_txt).unwrap();
            let episode: u32 = caps.get(0).map_or("", |m| m.as_str()).parse().unwrap();
            Some([season, episode])
        } else {
            Some([season, 0])
        }
    } else if info_reg[2].is_match(&temp_txt) || info_reg[3].is_match(&temp_txt) {
        if info_reg[2].is_match(&temp_txt) {
            let caps = info_reg[2].captures(&temp_txt).unwrap();
            let episode: u32 = caps.get(1).map_or("", |m| m.as_str()).parse().unwrap();
            Some([1, episode])
        } else if info_reg[3].is_match(&temp_txt) {
            let caps = info_reg[3].captures(&temp_txt).unwrap();
            let episode: u32 = caps.get(1).map_or("", |m| m.as_str()).parse().unwrap();
            Some([1, episode])
        } else {
            None
        }
    } else {
        None
    }
}

pub fn extract_showname(input: PathBuf) -> String {
    let filename = get_filename(input);
    let mut result = filename.clone();
    result = remove_enclosure(result);
    result = remove_dictionnary_words(result);
    result = remove_infos(result);
    result
}

fn get_parentdir(input: &PathBuf) -> &Path {
    input.parent().unwrap()
}

fn remove_enclosure(filename: String) -> String {
    let mut result = filename.clone().to_lowercase();
    if let Some(enclosure_start) = result.find('(') {
        if let Some(mut enclosure_end) = result[enclosure_start..].find(')') {
            enclosure_end = enclosure_end + enclosure_start + 1;
            result.replace_range(enclosure_start..enclosure_end, "");
        };
    };
    if let Some(enclosure_start) = result.find('{') {
        if let Some(mut enclosure_end) = result[enclosure_start..].find('}') {
            enclosure_end = enclosure_end + enclosure_start + 1;
            result.replace_range(enclosure_start..enclosure_end, "");
        };
    };
    if let Some(enclosure_start) = result.find('[') {
        if let Some(mut enclosure_end) = result[enclosure_start..].find(']') {
            enclosure_end = enclosure_end + enclosure_start + 1;
            result.replace_range(enclosure_start..enclosure_end, "");
        };
    };
    result
}

fn remove_dictionnary_words(filename: String) -> String {
    let encoding: Vec<&str> = vec![
        "x264", "x265", "h264", "h265", "hevc", "8-bits", "10-bits", "nvenc", "bluray", "bdrip",
        "hdrip", "dvdrip", "webrip", "xrip", "hdlight",
    ];
    let resolution: Vec<&str> = vec!["480p", "720p", "1080p"];
    let language: Vec<&str> = vec![
        "french",
        "fr",
        "truefrench",
        "sub",
        "multisub",
        "multi-sub",
        "vf",
        "vff",
        "vostfr",
        "eng",
    ];
    let audio_encoding: Vec<&str> = vec!["ac3", "aac"];
    let remove_dictionnary: Vec<Vec<&str>> = vec![encoding, resolution, language, audio_encoding];
    let result = filename.clone().to_lowercase();
    let separator = if result.contains(' ') {
        " "
    } else if result.contains('-') {
        "-"
    } else {
        " "
    };
    let mut to_remove: Vec<usize> = vec![];
    for (idx, entry) in result.split(separator).enumerate() {
        for dictionnary in &remove_dictionnary {
            for word in dictionnary {
                if &entry == word {
                    to_remove.push(idx);
                }
            }
        }
    }
    let mut result_vec = result.split(separator).collect::<Vec<&str>>();
    for (removed, index) in to_remove.into_iter().enumerate() {
        result_vec.remove(index - removed);
    }
    result_vec.join(" ")
}

fn remove_infos(text: String) -> String {
    let info_set = vec![
        r"[Ss]([0-9]+)[ ._-]*[Ee]([0-9]+)", // S03E04
        r"s([eai]+son\W?)?(\d{1,2})",       // Season 1
        r"(episode[s]?|\Wep)?\W(\d{1,3})",  // Episode 1, Ep 1
        r"[\-\s]?\W(\d{1,3})[\W\.]?",       // - 13
    ];
    let info_reg: Vec<Regex> = info_set
        .into_iter()
        .map(|x| Regex::new(x).unwrap())
        .collect();
    let mut temp_txt = text.clone().to_lowercase();
    for reg in info_reg {
        temp_txt = reg.replace_all(temp_txt.as_str(), "").clone().to_string();
    }
    temp_txt.trim().to_string()
}
