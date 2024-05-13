import * as installer from '@ffmpeg-installer/ffmpeg';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

export class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  convertToMp3(inputFilePath: string, outputFilePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const command = ffmpeg(inputFilePath)
          .inputOption('-t 30')
          .output(outputFilePath)
          .on('end', () => resolve(outputFilePath))
          .on('error', (err) => reject(err.message));
        command.run();
      } catch (e: any) {
        reject(e.message);
      }
    });
  }

  async deleteFile(filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err.message);
          } else {
            resolve();
          }
        });
      } catch (e: any) {
        reject(e.message);
      }
    });
  }
}
