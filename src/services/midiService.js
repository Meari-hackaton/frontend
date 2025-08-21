// MIDI 음악 생성 서비스
class MidiService {
  static API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  static async generateMidi() {
    const response = await fetch(`${this.API_URL}/api/v1/create-midi`, {
      method: 'GET',
      headers: {
        'Accept': 'audio/midi'
      },
      credentials: 'include' // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error(`MIDI 생성 실패: ${response.status}`);
    }

    return response.blob();
  }

  static downloadBlob(blob, filename = 'meari-healing-music.mid') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async generateAndDownload() {
    try {
      const midiBlob = await this.generateMidi();
      const timestamp = new Date().toISOString().split('T')[0];
      this.downloadBlob(midiBlob, `meari-music-${timestamp}.mid`);
      return true;
    } catch (error) {
      console.error('MIDI 다운로드 실패:', error);
      throw error;
    }
  }
}

export default MidiService;