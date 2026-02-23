import { MapPin, Landmark, DollarSign, Sun, Cloud, Accessibility } from "lucide-react";
import type { PlaceType, EntryCost, Season, Climate, Accessibility as AccessibilityType } from "@/data/places";
import { departments, cities, placeTypes, entryCosts, seasons, climates, accessibilityLevels, places } from "@/data/places";
import { useMemo } from "react";

export interface Filters {
  department: string;
  city: string;
  type: PlaceType | "";
  entryCost: EntryCost | "";
  season: Season | "";
  climate: Climate | "";
  accessibility: AccessibilityType | "";
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const FilterChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all border ${
      active
        ? "bg-primary text-primary-foreground border-primary shadow-md"
        : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-secondary"
    }`}
  >
    {label}
  </button>
);

const FilterSection = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="font-display font-semibold text-foreground text-sm md:text-base">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const SearchFilters = ({ filters, onChange }: Props) => {
  const toggleSingle = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: filters[key] === value ? "" : value });
  };

  // Filter cities based on selected department
  const availableCities = useMemo(() => {
    if (!filters.department) return cities;
    return [...new Set(places.filter((p) => p.department === filters.department).map((p) => p.city))].sort();
  }, [filters.department]);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
          Buscar lugares turísticos
        </h2>
        <button
          onClick={() =>
            onChange({ department: "", city: "", type: "", entryCost: "", season: "", climate: "", accessibility: "" })
          }
          className="text-sm font-body text-muted-foreground hover:text-accent transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Location */}
      <FilterSection icon={<MapPin className="w-5 h-5 text-accent" />} title="Ubicación">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <select
            value={filters.department}
            onChange={(e) => onChange({ ...filters, department: e.target.value, city: "" })}
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">Todos los departamentos</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={filters.city}
            onChange={(e) => onChange({ ...filters, city: e.target.value })}
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">Todas las ciudades</option>
            {availableCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* Place Type */}
      <FilterSection icon={<Landmark className="w-5 h-5 text-accent" />} title="Tipo de lugar">
        {placeTypes.map((type) => (
          <FilterChip
            key={type}
            label={type}
            active={filters.type === type}
            onClick={() => toggleSingle("type", type)}
          />
        ))}
      </FilterSection>

      {/* Entry Cost */}
      <FilterSection icon={<DollarSign className="w-5 h-5 text-accent" />} title="Costo de ingreso">
        {entryCosts.map((cost) => (
          <FilterChip
            key={cost}
            label={cost}
            active={filters.entryCost === cost}
            onClick={() => toggleSingle("entryCost", cost)}
          />
        ))}
      </FilterSection>

      {/* Season */}
      <FilterSection icon={<Sun className="w-5 h-5 text-accent" />} title="Temporada recomendada">
        {seasons.map((s) => (
          <FilterChip
            key={s}
            label={s}
            active={filters.season === s}
            onClick={() => toggleSingle("season", s)}
          />
        ))}
      </FilterSection>

      {/* Climate */}
      <FilterSection icon={<Cloud className="w-5 h-5 text-accent" />} title="Clima predominante">
        {climates.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={filters.climate === c}
            onClick={() => toggleSingle("climate", c)}
          />
        ))}
      </FilterSection>

      {/* Accessibility */}
      <FilterSection icon={<Accessibility className="w-5 h-5 text-accent" />} title="Nivel de accesibilidad">
        {accessibilityLevels.map((a) => (
          <FilterChip
            key={a}
            label={a}
            active={filters.accessibility === a}
            onClick={() => toggleSingle("accessibility", a)}
          />
        ))}
      </FilterSection>
    </div>
  );
};

export default SearchFilters;
