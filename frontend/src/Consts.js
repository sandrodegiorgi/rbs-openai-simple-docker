const packageJson = require('../package.json');

// export const SERVER_URL = 'http://127.0.0.1:5000';
export const SERVER_URL = 'https://rbs-ai.degiorgi.de';

export const ASSISTANT_URL = "/api/assistants";
export const INTERACT_EPILOGUE = "/interact";

export const interaction_type_chat = "general_chat";

export const headline_available_assistants = "Available Assistants";

export const label_default = "Make a song about unicorns...";
export const label_enter_password = "Bitte geben Sie - JE nach Anwendung - das entsprechende Passwort ein";
export const label_show_hide_password = "Ihr eingegebenes Passwort anzeigen bzw. verbergen";
export const label_send_assistant = "Prompt senden";
export const label_send_general_chat = label_send_assistant;
export const label_send_image_generation = "Bild generieren";
export const label_general_chat = "Willkommen beim 'allgemeinen Chat' - lassen Sie uns sprechen!";
export const label_send_prompt_working = "Anfrage in Bearbeitung! Bitte etwas Geduld...";
export const label_reload_assistants = "Assistenten neu laden";
export const label_reload_assistants_confirm = "Ja, neu laden";
export const label_reload_assistants_cancel = "Abbrechen";
export const label_send_translate = "Übersetzen";

// export const tooltip_send_assitant = "Prüfen Sie auf korrektes Passwort und klicken Sie dann hier, um die Nachricht abzusenden.";
export const tooltip_version = "You are currently working with version " + packageJson.version + ". For any questions or issues, please contact Siggi Sternenstaub directly.";
export const tooltip_send_assistant = "Klicken Sie hier, um Ihren Prompt abzusenden.";
export const tooltip_send_general_chat = tooltip_send_assistant;
export const tooltip_copy_raw_response_to_clipboard = "Klicken Sie hier, um das Ergebnis in die Zwischenablage zu kopieren.";
export const tooltip_send_image_generation = "Klicken Sie hier, um das Bild generieren zu lassen (ETA 30s).";
export const tooltip_reload_assistants = "Klicken Sie hier, um die Assistenten neu zu laden. Wenn neue Assistenten erstellt oder bestehende verändert wurden, kann es bis zu fünf Minuten dauern, bis hier die Anpassungen neu geladen werden können.";
export const tooltip_copy_assistant_link_to_clipboard = "in die Zwischenablage kopieren.";
export const tooltip_translate_source_language = "Wählen Sie die Sprache, in der Ihr Text geschrieben ist.";
export const tooltip_translate_target_language = "Wählen Sie die Sprache, in die Ihr Text übersetzt werden soll.";
export const tooltip_send_translate = "Klicken Sie hier, um den Text zu übersetzen.";

export const system_message_unauthorized = "Der Server hat Ihre Anfrage abgelehnt. Bitte überprüfen Sie Ihr eingegebenes Passwort und versuchen Sie es erneut.";
export const system_missing_data = "Der Server hat Ihre Anfrage abgelehnt. Es fehlen notwendige Daten in Ihrer Anfrage.";
export const system_missing_dl_image = "Es ist leider ein Fehler aufgetreten. Das Bild kann nicht dargestellt werden :/";
export const system_message_error = "Es ist leider ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.";

export const text_reload_assistants_are_you_sure = "Sind Sie sicher, dass Sie die Assistenten neu laden möchten?";

export const default_tooltip_show = 150;
export const default_tooltip_hide = 100;

export const LANGUAGES = [
    { value: 'auto-detect', label: 'auto-detect' },
    { value: 'Afrikaans', label: 'Afrikaans' },
    { value: 'Albanian', label: 'Albanian' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Armenian', label: 'Armenian' },
    { value: 'Azerbaijani', label: 'Azerbaijani' },
    { value: 'Basque', label: 'Basque' },
    { value: 'Belarusian', label: 'Belarusian' },
    { value: 'Bengali', label: 'Bengali' },
    { value: 'Norwegian Bokmal', label: 'Norwegian Bokmal' },
    { value: 'Bosnian', label: 'Bosnian' },
    { value: 'Bulgarian', label: 'Bulgarian' },
    { value: 'Catalan', label: 'Catalan' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Croatian', label: 'Croatian' },
    { value: 'Czech', label: 'Czech' },
    { value: 'Danish', label: 'Danish' },
    { value: 'Dutch', label: 'Dutch' },
    { value: 'English', label: 'English' },
    { value: 'Esperanto', label: 'Esperanto' },
    { value: 'Estonian', label: 'Estonian' },
    { value: 'Finnish', label: 'Finnish' },
    { value: 'French', label: 'French' },
    { value: 'Ganda', label: 'Ganda' },
    { value: 'Georgian', label: 'Georgian' },
    { value: 'German', label: 'German' },
    { value: 'Greek', label: 'Greek' },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'Hebrew', label: 'Hebrew' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Hungarian', label: 'Hungarian' },
    { value: 'Icelandic', label: 'Icelandic' },
    { value: 'Indonesian', label: 'Indonesian' },
    { value: 'Irish', label: 'Irish' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Kazakh', label: 'Kazakh' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Latin', label: 'Latin' },
    { value: 'Latvian', label: 'Latvian' },
    { value: 'Lithuanian', label: 'Lithuanian' },
    { value: 'Macedonian', label: 'Macedonian' },
    { value: 'Malay', label: 'Malay' },
    { value: 'Maori', label: 'Maori' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Mongolian', label: 'Mongolian' },
    { value: 'Norwegian Nynorsk', label: 'Norwegian Nynorsk' },
    { value: 'Persian', label: 'Persian' },
    { value: 'Polish', label: 'Polish' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Punjabi', label: 'Punjabi' },
    { value: 'Romanian', label: 'Romanian' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Serbian', label: 'Serbian' },
    { value: 'Shona', label: 'Shona' },
    { value: 'Slovak', label: 'Slovak' },
    { value: 'Slovene', label: 'Slovene' },
    { value: 'Somali', label: 'Somali' },
    { value: 'Sotho', label: 'Sotho' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'Swahili', label: 'Swahili' },
    { value: 'Swedish', label: 'Swedish' },
    { value: 'Tagalog', label: 'Tagalog' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Telugu', label: 'Telugu' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Tsonga', label: 'Tsonga' },
    { value: 'Tswana', label: 'Tswana' },
    { value: 'Turkish', label: 'Turkish' },
    { value: 'Ukrainian', label: 'Ukrainian' },
    { value: 'Urdu', label: 'Urdu' },
    { value: 'Vietnamese', label: 'Vietnamese' },
    { value: 'Welsh', label: 'Welsh' },
    { value: 'Xhosa', label: 'Xhosa' },
    { value: 'Yoruba', label: 'Yoruba' },
    { value: 'Zulu', label: 'Zulu' },
];