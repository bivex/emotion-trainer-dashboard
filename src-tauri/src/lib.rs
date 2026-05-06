use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use walkdir::WalkDir;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct EmotionImage {
    pub path: String,
    pub absolute_path: String,
    pub emotion: String,
    pub filename: String,
}

const EMOTIONS: &[&str] = &[
    "joy", "sadness", "anger", "fear", "surprise",
    "disgust", "guilt", "shame", "suspicion", "neutral",
];

const IMAGE_FOLDER_SUFFIXES: &[&str] = &[
    "generated_images_v2_g",
    "generated_images_v2_g1",
    "generated_images_v2_g2",
    "generated_images_v2_g3",
    "generated_images_v2_g4",
    "generated_images1",
    "generated_images2",
    "generated_images3",
];

fn get_base_path() -> PathBuf {
    PathBuf::from("/Volumes/External/GenEmotions")
}

#[tauri::command]
fn scan_images() -> Vec<EmotionImage> {
    let base = get_base_path();
    let mut all_images = Vec::new();

    for suffix in IMAGE_FOLDER_SUFFIXES {
        let folder = base.join(suffix);
        if !folder.exists() {
            continue;
        }
        let folder_name = suffix.to_string();

        for emotion in EMOTIONS {
            let emotion_path = folder.join(emotion);
            if !emotion_path.exists() {
                continue;
            }

            for entry in WalkDir::new(&emotion_path)
                .into_iter()
                .filter_map(|e| e.ok())
                .filter(|e| e.file_type().is_file())
            {
                let path = entry.path();
                let ext = path
                    .extension()
                    .and_then(|e| e.to_str())
                    .map(|e| e.to_lowercase())
                    .unwrap_or_default();

                if ext == "png" || ext == "jpg" || ext == "jpeg" {
                    let filename = path
                        .file_name()
                        .unwrap_or_default()
                        .to_string_lossy()
                        .to_string();
                    let absolute_path = path.to_string_lossy().to_string();
                    // Keep a relative-style path for reference
                    let relative = path
                        .strip_prefix(&folder)
                        .map(|p| p.to_string_lossy().to_string())
                        .unwrap_or_else(|_| filename.clone());

                    all_images.push(EmotionImage {
                        path: format!("/images/{}/{}", folder_name, relative.replace('\\', "/")),
                        absolute_path,
                        emotion: emotion.to_string(),
                        filename,
                    });
                }
            }
        }
    }

    all_images
}

#[tauri::command]
fn get_image_stats() -> std::collections::HashMap<String, usize> {
    let images = scan_images();
    let mut stats: std::collections::HashMap<String, usize> = EMOTIONS
        .iter()
        .map(|e| (e.to_string(), 0))
        .collect();

    for img in images {
        *stats.entry(img.emotion).or_insert(0) += 1;
    }

    stats
}

#[tauri::command]
fn open_devtools(window: tauri::Window) -> Result<(), String> {
    #[cfg(debug_assertions)]
    {
        window.with_webview(|webview| {
            webview.open_devtools();
        }).map_err(|e| e.to_string())?;
        Ok(())
    }
    #[cfg(not(debug_assertions))]
    {
        Err("DevTools are only available in debug builds".to_string())
    }
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scan_images, get_image_stats, open_devtools])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
