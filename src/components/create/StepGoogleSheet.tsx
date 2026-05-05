"use client";

import { useState } from "react";
import type { CardData } from "@/lib/card-data";

interface Props {
  form: CardData;
  update: (field: keyof CardData, value: string) => void;
}

const SCRIPT_CODE = `function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  if (data.action === "add") {
    sheet.appendRow([data.name, ""]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }

  if (data.action === "rsvp") {
    const rows = sheet.getDataRange().getValues();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === data.name) {
        sheet.getRange(i + 1, 2).setValue(data.participate);
        const color = data.participate === "Yes" ? "#d4edda" : "#f8d7da";
        sheet.getRange(i + 1, 1, 1, 2).setBackground(color);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }

  if (data.action === "saveCard") {
    let configSheet = ss.getSheetByName("Config");
    if (!configSheet) configSheet = ss.insertSheet("Config");
    configSheet.getRange("A1").setValue(data.cardData);
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (e.parameter.action === "fetch") {
    const sheet = ss.getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    const names = rows.slice(1).map(r => r[0]).filter(Boolean);
    return ContentService.createTextOutput(JSON.stringify({ names }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (e.parameter.action === "getCard") {
    const configSheet = ss.getSheetByName("Config");
    if (!configSheet) {
      return ContentService.createTextOutput(JSON.stringify({ cardData: null }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const cardData = configSheet.getRange("A1").getValue();
    return ContentService.createTextOutput(JSON.stringify({ cardData }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export default function StepGoogleSheet({ form, update }: Props) {
  const [copied, setCopied] = useState(false);

  function copyScript() {
    navigator.clipboard.writeText(SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Google Sheet for RSVP Tracking</h2>
      <p className="text-sm text-gray-500">Connect your Google Sheet to track who accepts/declines.</p>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Google Apps Script URL</label>
        <input type="url" value={form.googleScriptUrl} onChange={(e) => update("googleScriptUrl", e.target.value)}
          placeholder="https://script.google.com/macros/s/.../exec"
          className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
      </div>

      {/* Setup instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 space-y-3">
        <p className="font-medium">Quick Setup (5 minutes):</p>
        <ol className="list-decimal list-inside space-y-2 text-xs">
          <li>Go to <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="underline">sheets.google.com</a> → Create blank sheet</li>
          <li>In Row 1, add headers: <code className="bg-blue-100 px-1 rounded">Invitee Name</code> | <code className="bg-blue-100 px-1 rounded">Participate</code></li>
          <li>Go to <strong>Extensions → Apps Script</strong></li>
          <li>Delete existing code, paste the script below, click Save</li>
          <li>Click <strong>Deploy → New deployment</strong> → Type: Web app → Execute as: Me → Access: Anyone</li>
          <li>Click Deploy → Authorize → Copy the Web app URL and paste above</li>
        </ol>
      </div>

      {/* Script code */}
      <div className="relative">
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-xs text-green-300 whitespace-pre">{SCRIPT_CODE}</pre>
        </div>
        <button onClick={copyScript}
          className="absolute top-2 right-2 text-xs px-3 py-1.5 bg-white/90 text-gray-800 rounded-md hover:bg-white transition">
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>
      </div>

      <p className="text-xs text-gray-400">If you skip this step, your card will still work — guests just won&apos;t be tracked.</p>
    </div>
  );
}
