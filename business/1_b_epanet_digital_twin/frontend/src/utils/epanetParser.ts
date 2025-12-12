export interface Junction {
  id: string;
  elevation: number;
  demand: number;
  pattern?: string;
}

export interface Reservoir {
  id: string;
  head: number;
  pattern?: string;
}

export interface Tank {
  id: string;
  elevation: number;
  initLevel: number;
  minLevel: number;
  maxLevel: number;
  diameter: number;
  minVol: number;
  volCurve?: string;
}

export interface Pipe {
  id: string;
  node1: string;
  node2: string;
  length: number;
  diameter: number;
  roughness: number;
  minorLoss: number;
  status: string;
}

export interface Pump {
  id: string;
  node1: string;
  node2: string;
  parameters: string;
}

export interface Valve {
  id: string;
  node1: string;
  node2: string;
  diameter: number;
  type: string;
  setting: number;
  minorLoss: number;
}

export interface Coordinate {
  nodeId: string;
  x: number;
  y: number;
}

export interface Vertex {
  linkId: string;
  x: number;
  y: number;
}

export interface Zone {
  id: string;
  name: string;
  polygon: Array<{ lat: number; lng: number }>; // Polygon coordinates in WGS84
  pipes: string[]; // Pipe IDs in this zone
  junctions: string[]; // Junction IDs in this zone
}

export interface ParsedNetwork {
  title: string;
  junctions: Junction[];
  reservoirs: Reservoir[];
  tanks: Tank[];
  pipes: Pipe[];
  pumps: Pump[];
  valves: Valve[];
  coordinates: Coordinate[];
  vertices: Vertex[];
  demands: Array<{
    junction: string;
    demand: number;
    pattern?: string;
    category?: string;
  }>;
  zones?: Zone[]; // Optional zones array
}

export class EPANETParser {
  private parseSection(sectionName: string, lines: string[]): string[] {
    const startIndex = lines.findIndex(line =>
      line.trim().toUpperCase() === `[${sectionName.toUpperCase()}]`
    );

    if (startIndex === -1) return [];

    const sectionLines: string[] = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();

      // Stop at next section or empty line
      if (line.startsWith('[') || line === '') {
        break;
      }

      // Skip comment lines
      if (line.startsWith(';') || line === '') {
        continue;
      }

      sectionLines.push(line);
    }

    return sectionLines;
  }

  /**
   * Parse JUNCTIONS section from EPANET .inp file.
   * 
   * IMPORTANT: EPANET .inp files can have demands in TWO places:
   * 1. In the JUNCTIONS section (3rd column) - often set to 0
   * 2. In a separate [DEMANDS] section - contains the actual demand values
   * 
   * This method reads the demand from JUNCTIONS section, but the actual
   * demands are merged from the DEMANDS section in parseINPFile().
   * 
   * Format: ID Elevation Demand Pattern
   * Example: "29 957 0" (demand is 0, actual demand is in DEMANDS section)
   */
  private parseJunctions(lines: string[]): Junction[] {
    const sectionLines = this.parseSection('JUNCTIONS', lines);
    return sectionLines.map(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      return {
        id: parts[0],
        elevation: parseFloat(parts[1]) || 0,
        demand: parseFloat(parts[2]) || 0, // May be 0 if demands are in DEMANDS section
        pattern: parts[3] || undefined
      };
    });
  }

  private parseReservoirs(lines: string[]): Reservoir[] {
    const sectionLines = this.parseSection('RESERVOIRS', lines);
    return sectionLines.map(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      return {
        id: parts[0],
        head: parseFloat(parts[1]) || 0,
        pattern: parts[2] || undefined
      };
    });
  }

  private parseTanks(lines: string[]): Tank[] {
    const sectionLines = this.parseSection('TANKS', lines);
    return sectionLines.map(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      return {
        id: parts[0],
        elevation: parseFloat(parts[1]) || 0,
        initLevel: parseFloat(parts[2]) || 0,
        minLevel: parseFloat(parts[3]) || 0,
        maxLevel: parseFloat(parts[4]) || 0,
        diameter: parseFloat(parts[5]) || 0,
        minVol: parseFloat(parts[6]) || 0,
        volCurve: parts[7] || undefined
      };
    });
  }

  private parsePipes(lines: string[]): Pipe[] {
    const sectionLines = this.parseSection('PIPES', lines);
    return sectionLines.map(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      return {
        id: parts[0],
        node1: parts[1],
        node2: parts[2],
        length: parseFloat(parts[3]) || 0,
        diameter: parseFloat(parts[4]) || 0,
        roughness: parseFloat(parts[5]) || 0,
        minorLoss: parseFloat(parts[6]) || 0,
        status: parts[7] || 'Open'
      };
    });
  }

  private parsePumps(lines: string[]): Pump[] {
    const sectionLines = this.parseSection('PUMPS', lines);
    return sectionLines.map(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      return {
        id: parts[0],
        node1: parts[1],
        node2: parts[2],
        parameters: parts.slice(3).join(' ')
      };
    });
  }

  private parseValves(lines: string[]): Valve[] {
    const sectionLines = this.parseSection('VALVES', lines);
    return sectionLines.map(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      return {
        id: parts[0],
        node1: parts[1],
        node2: parts[2],
        diameter: parseFloat(parts[3]) || 0,
        type: parts[4] || '',
        setting: parseFloat(parts[5]) || 0,
        minorLoss: parseFloat(parts[6]) || 0
      };
    });
  }

  private parseCoordinates(lines: string[]): Coordinate[] {
    const sectionLines = this.parseSection('COORDINATES', lines);
    return sectionLines.map(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      return {
        nodeId: parts[0],
        x: parseFloat(parts[1]) || 0,
        y: parseFloat(parts[2]) || 0
      };
    });
  }

  private parseVertices(lines: string[]): Vertex[] {
    const sectionLines = this.parseSection('VERTICES', lines);
    return sectionLines.map(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      return {
        linkId: parts[0],
        x: parseFloat(parts[1]) || 0,
        y: parseFloat(parts[2]) || 0
      };
    });
  }

  /**
   * Parse DEMANDS section from EPANET .inp file.
   * 
   * IMPORTANT: EPANET .inp files can have demands in TWO places:
   * 1. In the JUNCTIONS section (3rd column) - often set to 0
   * 2. In a separate [DEMANDS] section - contains the actual demand values
   * 
   * This method reads the DEMANDS section which contains the actual demand values.
   * These demands are merged into the junctions in parseINPFile().
   * 
   * Format: JunctionID Demand Pattern Category
   * Example: "29 1.37375" (actual demand for junction 29)
   */
  private parseDemands(lines: string[]): Array<{
    junction: string;
    demand: number;
    pattern?: string;
    category?: string;
  }> {
    const sectionLines = this.parseSection('DEMANDS', lines);
    return sectionLines.map(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      return {
        junction: parts[0],
        demand: parseFloat(parts[1]) || 0,
        pattern: parts[2] || undefined,
        category: parts[3] || undefined
      };
    });
  }

  private parseTitle(lines: string[]): string {
    const titleSection = this.parseSection('TITLE', lines);
    return titleSection.join(' ').trim() || 'Untitled Network';
  }

  /**
   * Parse ZONES section from EPANET .inp file.
   * Custom section for storing zone information.
   * 
   * Format: ZoneName PolygonCoordinates Pipes Junctions
   * Example: "Zone1 31.9522,35.2332 31.9530,35.2340 P1 P2 P3 J1 J2 J3"
   */
  private parseZones(lines: string[]): Zone[] {
    const sectionLines = this.parseSection('ZONES', lines);
    const zones: Zone[] = [];
    
    sectionLines.forEach((line, index) => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      if (parts.length < 3) return; // Need at least name, one coordinate, and one item
      
      const zoneName = parts[0];
      const polygon: Array<{ lat: number; lng: number }> = [];
      const pipes: string[] = [];
      const junctions: string[] = [];
      
      // Parse coordinates (format: lat,lng pairs)
      let i = 1;
      while (i < parts.length && parts[i].includes(',') && !parts[i].startsWith('|')) {
        const [lat, lng] = parts[i].split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          polygon.push({ lat, lng });
        }
        i++;
      }
      
      // Find PIPES and JUNCTIONS markers
      let pipesStart = -1;
      let junctionsStart = -1;
      for (let j = i; j < parts.length; j++) {
        if (parts[j] === '|PIPES|') {
          pipesStart = j + 1;
        } else if (parts[j] === '|JUNCTIONS|') {
          junctionsStart = j + 1;
          break;
        }
      }
      
      // Parse pipes (between |PIPES| and |JUNCTIONS|)
      if (pipesStart !== -1 && junctionsStart !== -1) {
        for (let j = pipesStart; j < junctionsStart - 1; j++) {
          if (parts[j] && parts[j] !== '|PIPES|') {
            pipes.push(parts[j]);
          }
        }
      }
      
      // Parse junctions (after |JUNCTIONS|)
      if (junctionsStart !== -1) {
        for (let j = junctionsStart; j < parts.length; j++) {
          if (parts[j] && parts[j] !== '|JUNCTIONS|') {
            junctions.push(parts[j]);
          }
        }
      }
      
      zones.push({
        id: `zone-${index}-${Date.now()}`,
        name: zoneName,
        polygon,
        pipes,
        junctions
      });
    });
    
    return zones;
  }

  /**
   * Parse TAGS section from EPANET .inp file.
   * Standard EPANET section for tagging nodes and links.
   * 
   * Format: Object ID Tag
   * Example: "NODE J1 Zone1" or "LINK P1 Zone1"
   */
  private parseTags(lines: string[]): Map<string, string> {
    const sectionLines = this.parseSection('TAGS', lines);
    const tagMap = new Map<string, string>();
    
    sectionLines.forEach(line => {
      const parts = line.split(/\s+/).filter(part => part !== '');
      if (parts.length >= 3) {
        const objectType = parts[0].toUpperCase(); // NODE or LINK
        const id = parts[1];
        const tag = parts.slice(2).join(' '); // Tag name (may contain spaces)
        
        // Store as "NODE:J1" or "LINK:P1" for unique identification
        const key = `${objectType}:${id}`;
        tagMap.set(key, tag);
      }
    });
    
    return tagMap;
  }

  /**
   * Parse an EPANET .inp file and return a structured network object.
   * 
   * IMPORTANT: EPANET .inp files can have demands in TWO places:
   * 1. In the JUNCTIONS section (3rd column) - often set to 0
   * 2. In a separate [DEMANDS] section - contains the actual demand values
   * 
   * This method handles both cases by:
   * - Parsing demands from JUNCTIONS section (may be 0)
   * - Parsing demands from DEMANDS section (actual values)
   * - Merging DEMANDS section values into junction objects (overwrites JUNCTIONS values)
   * 
   * This ensures that junction.demand always contains the correct demand value,
   * whether it comes from JUNCTIONS or DEMANDS section.
   */
  public parseINPFile(content: string): ParsedNetwork {
    const lines = content.split('\n');

    const parsed = {
      title: this.parseTitle(lines),
      junctions: this.parseJunctions(lines),
      reservoirs: this.parseReservoirs(lines),
      tanks: this.parseTanks(lines),
      pipes: this.parsePipes(lines),
      pumps: this.parsePumps(lines),
      valves: this.parseValves(lines),
      coordinates: this.parseCoordinates(lines),
      vertices: this.parseVertices(lines),
      demands: this.parseDemands(lines),
      zones: this.parseZones(lines)
    };

    // Merge demands from DEMANDS section into junctions
    // EPANET files often have demands=0 in JUNCTIONS section, with actual
    // demands in a separate DEMANDS section. This merge ensures junction.demand
    // contains the correct value from DEMANDS section if it exists.
    const demandsMap = new Map<string, number>();
    parsed.demands.forEach(d => {
      demandsMap.set(d.junction, d.demand);
    });

    // Update junction demands from DEMANDS section (overwrites JUNCTIONS values)
    parsed.junctions.forEach(junction => {
      const demandFromSection = demandsMap.get(junction.id);
      if (demandFromSection !== undefined) {
        junction.demand = demandFromSection;
      }
    });

    // Enhance zones with information from TAGS section if available
    const tagsMap = this.parseTags(lines);
    if (parsed.zones && parsed.zones.length > 0 && tagsMap.size > 0) {
      // If zones exist and tags exist, verify/update zone membership from tags
      parsed.zones.forEach(zone => {
        // Tags can help identify which items belong to which zone
        // This is a secondary source of truth
        tagsMap.forEach((tag, key) => {
          if (tag === zone.name) {
            const [objectType, id] = key.split(':');
            if (objectType === 'NODE' && !zone.junctions.includes(id)) {
              zone.junctions.push(id);
            } else if (objectType === 'LINK' && !zone.pipes.includes(id)) {
              zone.pipes.push(id);
            }
          }
        });
      });
    }

    return parsed;
  }

  public async parseINPFileFromFile(file: File): Promise<ParsedNetwork> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = this.parseINPFile(content);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Failed to parse INP file: ${error}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Write zones to .inp file content format.
   * Adds [ZONES] and [TAGS] sections to the file content.
   * 
   * @param content - Original .inp file content
   * @param zones - Array of zones to write
   * @returns Updated .inp file content with zones
   */
  public writeZonesToINP(content: string, zones: Zone[]): string {
    const lines = content.split('\n');
    let result: string[] = [];
    
    // Find [END] marker or end of file
    let endIndex = lines.findIndex(line => line.trim().toUpperCase() === '[END]');
    if (endIndex === -1) {
      endIndex = lines.length;
    }
    
    // Copy all lines before [END]
    result = lines.slice(0, endIndex);
    
    // Remove existing [ZONES] and [TAGS] sections if they exist
    let zonesStart = -1;
    let zonesEnd = -1;
    let tagsStart = -1;
    let tagsEnd = -1;
    
    for (let i = 0; i < result.length; i++) {
      const line = result[i].trim().toUpperCase();
      if (line === '[ZONES]') {
        zonesStart = i;
        // Find end of ZONES section
        for (let j = i + 1; j < result.length; j++) {
          if (result[j].trim().startsWith('[') && result[j].trim() !== '') {
            zonesEnd = j;
            break;
          }
        }
        if (zonesEnd === -1) zonesEnd = result.length;
      }
      if (line === '[TAGS]') {
        tagsStart = i;
        // Find end of TAGS section
        for (let j = i + 1; j < result.length; j++) {
          if (result[j].trim().startsWith('[') && result[j].trim() !== '') {
            tagsEnd = j;
            break;
          }
        }
        if (tagsEnd === -1) tagsEnd = result.length;
      }
    }
    
    // Remove existing sections
    if (zonesStart !== -1 && zonesEnd !== -1) {
      result.splice(zonesStart, zonesEnd - zonesStart);
    }
    if (tagsStart !== -1 && tagsEnd !== -1) {
      // Adjust indices if zones section was removed
      if (zonesStart !== -1 && zonesStart < tagsStart) {
        tagsStart -= (zonesEnd - zonesStart);
      }
      result.splice(tagsStart, tagsEnd - tagsStart);
    }
    
    // Add new [ZONES] section
    if (zones.length > 0) {
      result.push('');
      result.push('[ZONES]');
      result.push(';ZoneName    PolygonCoordinates    |PIPES|    |JUNCTIONS|');
      
      zones.forEach(zone => {
        // Format polygon coordinates as "lat,lng lat,lng ..."
        const polygonStr = zone.polygon.map(coord => `${coord.lat},${coord.lng}`).join(' ');
        // Format pipes and junctions with delimiters
        const pipesStr = zone.pipes.join(' ');
        const junctionsStr = zone.junctions.join(' ');
        result.push(`${zone.name}    ${polygonStr}    |PIPES| ${pipesStr}    |JUNCTIONS| ${junctionsStr}`);
      });
    }
    
    // Add new [TAGS] section for EPANET compatibility
    if (zones.length > 0) {
      result.push('');
      result.push('[TAGS]');
      result.push(';Object  ID    Tag');
      
      zones.forEach(zone => {
        // Tag all junctions
        zone.junctions.forEach(junctionId => {
          result.push(`NODE    ${junctionId}    ${zone.name}`);
        });
        // Tag all pipes
        zone.pipes.forEach(pipeId => {
          result.push(`LINK    ${pipeId}    ${zone.name}`);
        });
      });
    }
    
    // Add [END] marker
    result.push('');
    result.push('[END]');
    
    return result.join('\n');
  }
}

// Export a default instance
export const epanetParser = new EPANETParser();
