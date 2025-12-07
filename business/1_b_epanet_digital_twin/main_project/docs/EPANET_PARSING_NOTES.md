# EPANET .inp File Parsing Notes

## Double Demand Data Structure

**IMPORTANT**: EPANET .inp files can store junction demands in **TWO different locations**:

### 1. JUNCTIONS Section
- **Location**: `[JUNCTIONS]` section
- **Format**: `ID Elevation Demand Pattern`
- **Example**: `29 957 0`
- **Note**: The demand value here is often set to `0` when actual demands are stored in a separate DEMANDS section

### 2. DEMANDS Section
- **Location**: `[DEMANDS]` section (separate section)
- **Format**: `JunctionID Demand Pattern Category`
- **Example**: `29 1.37375`
- **Note**: This section contains the **actual demand values** for junctions

## Why This Happens

EPANET allows demands to be specified in two ways:
1. **Inline in JUNCTIONS**: Simple format, all demand info in one line
2. **Separate DEMANDS section**: More flexible, allows multiple demand categories per junction, patterns, etc.

Many EPANET files use the DEMANDS section approach, especially when:
- Multiple demand categories exist per junction
- Demand patterns are applied
- Demands are managed separately from junction definitions

## How Our Parser Handles This

The `EPANETParser` class in `frontend/src/utils/epanetParser.ts` handles both cases:

1. **Parses JUNCTIONS section**: Reads demand from 3rd column (may be 0)
2. **Parses DEMANDS section**: Reads actual demand values
3. **Merges demands**: Overwrites junction demands with values from DEMANDS section

This ensures that `junction.demand` always contains the correct value, regardless of which section it comes from.

### Code Flow

```typescript
// 1. Parse both sections
junctions: this.parseJunctions(lines),  // May have demand=0
demands: this.parseDemands(lines)      // Has actual values

// 2. Merge DEMANDS into junctions
const demandsMap = new Map<string, number>();
parsed.demands.forEach(d => {
  demandsMap.set(d.junction, d.demand);
});

// 3. Update junction demands
parsed.junctions.forEach(junction => {
  const demandFromSection = demandsMap.get(junction.id);
  if (demandFromSection !== undefined) {
    junction.demand = demandFromSection;  // Overwrites JUNCTIONS value
  }
});
```

## Example .inp File Structure

```
[JUNCTIONS]
29 957 0 
31 956 0 
33 957 0 
...

[DEMANDS]
29 1.37375 
31 1.37375 
33 1.14479166666667 
...
```

In this example:
- JUNCTIONS section shows demand = 0 for all junctions
- DEMANDS section contains the actual demand values
- Parser merges DEMANDS values into junction objects

## Related Files

- `frontend/src/utils/epanetParser.ts` - Main parser implementation
- `frontend/src/components/NetworkOverlay.tsx` - Displays junction demands in UI


