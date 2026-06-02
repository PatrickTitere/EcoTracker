import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { useGeolocation } from "../hooks/useGeolocation";
import { HTL_SPENGERGASSE, WIEN_MITTE } from "../lib/locations";
import { CATEGORY_META } from "../lib/categories";
import { getActivityImage } from "../lib/activityImage";

const CATEGORIES = Object.keys(CATEGORY_META);

export function CreateActivityPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { position } = useGeolocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("cleanup");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radiusMeters, setRadiusMeters] = useState("100");
  const [xpReward, setXpReward] = useState("50");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setLoc = (lat: number, lng: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Bild max. 5 MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const createMutation = useMutation({
    mutationFn: () =>
      api.createActivity(
        {
          title,
          description,
          category,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          radiusMeters: parseInt(radiusMeters, 10),
          xpReward: parseInt(xpReward, 10),
        },
        imageFile
      ),
    onSuccess: (a) => {
      queryClient.invalidateQueries({ queryKey: ["nearby"] });
      navigate(`/activity/${a.id}`);
    },
    onError: () => setError("Erstellen fehlgeschlagen"),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      setError("Standort wählen");
      return;
    }
    setError(null);
    createMutation.mutate();
  };

  const fallbackPreview = getActivityImage({ category, imageUrl: null });

  return (
    <motion.div className="create-v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to="/dashboard" className="mission-back-text">
        ← Dashboard
      </Link>
      <h1>Mission erstellen</h1>

      <form onSubmit={onSubmit} className="create-v2-form">
        <label className="create-image-field">
          Missionsfoto
          <div
            className={`create-image-drop ${imagePreview ? "has-image" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <img
              src={imagePreview ?? fallbackPreview}
              alt=""
              className="create-image-preview"
            />
            <span className="create-image-hint">
              {imagePreview ? "Tippen zum Ersetzen" : "Foto hochladen oder Kategorie-Vorschau"}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onImageChange}
            hidden
          />
          {imagePreview && (
            <button type="button" className="create-image-remove" onClick={clearImage}>
              Bild entfernen
            </button>
          )}
        </label>

        <label>
          Titel
          <input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} />
        </label>
        <label>
          Beschreibung
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
        </label>
        <label>
          Kategorie
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((k) => (
              <option key={k} value={k}>
                {CATEGORY_META[k].label}
              </option>
            ))}
          </select>
        </label>

        <div className="loc-chips">
          <button type="button" disabled={!position} onClick={() => position && setLoc(position.lat, position.lng)}>
            GPS
          </button>
          <button type="button" onClick={() => setLoc(HTL_SPENGERGASSE.lat, HTL_SPENGERGASSE.lng)}>
            HTL
          </button>
          <button type="button" onClick={() => setLoc(WIEN_MITTE.lat, WIEN_MITTE.lng)}>
            Mitte
          </button>
        </div>
        <div className="create-coords">
          <label>
            Lat
            <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
          </label>
          <label>
            Lng
            <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
          </label>
        </div>
        <div className="create-coords">
          <label>
            Radius (m)
            <input type="number" value={radiusMeters} onChange={(e) => setRadiusMeters(e.target.value)} />
          </label>
          <label>
            XP
            <input type="number" value={xpReward} onChange={(e) => setXpReward(e.target.value)} />
          </label>
        </div>

        {error && <p className="flash flash--err">{error}</p>}
        <button type="submit" className="btn-glow btn-glow--full" disabled={createMutation.isPending}>
          Veröffentlichen
        </button>
      </form>
    </motion.div>
  );
}