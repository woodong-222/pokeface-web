import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DexPage.module.scss';
import Logo from 'src/assets/logobutton.svg?react';
import Button1 from 'src/assets/button1.svg?react';
import Button2 from 'src/assets/button2.svg?react';
import Button3 from 'src/assets/button3.svg?react';
import Button4 from 'src/assets/button4.svg?react';
import Button5 from 'src/assets/button5.svg?react';
import DeleteIcon from 'src/assets/delete.svg?react';
import PokeBall from 'src/assets/bell.svg?react';
import PokefaceLogo from 'src/assets/logo.svg?react';

const MAX_POKEMON = 151;

const TYPE_COLOR_MAP: Record<string, string> = {
  '노말': '#888888', '불꽃': '#E55A3C', '물': '#4A7FDD', '전기': '#E5B533',
  '플': '#4FA52E', '얼음': '#5BB8DD', '격투': '#E57F33', '독': '#9A56B8',
  '땅': '#B0714A', '비행': '#7A9DDD', '에스퍼': '#E55F7F', '벌레': '#9AA545',
  '바위': '#B8B388', '고스트': '#7A5F88', '드래곤': '#5F6BBC', '악': '#5A5858',
  '강철': '#6F95B8', '페어리': '#DD9FDD'
};

const TYPE_BOX_COLOR_MAP: Record<string, string> = {
  '노말': '#999999', '불꽃': '#FF612C', '물': '#2992FF', '전기': '#FFDB00', '플': '#43BF24',
  '얼음': '#42D8FF', '격투': '#FFA202', '독': '#994DCF', '땅': '#AB7939', '비행': '#95C9FF',
  '에스퍼': '#FF637F', '벌레': '#9FA424', '바위': '#BCB889', '고스트': '#6E4570',
  '드래곤': '#5462D6', '악': '#4F4747', '강철': '#6AAED3', '페어리': '#FFB1FF'
};

const TYPE_KOR: Record<string, string> = {
  normal: '노말', fire: '불꽃', water: '물', electric: '전기', grass: '플',
  ice: '얼음', fighting: '격투', poison: '독', ground: '땅', flying: '비행',
  psychic: '에스퍼', bug: '벌레', rock: '바위', ghost: '고스트',
  dragon: '드래곤', dark: '악', steel: '강철', fairy: '페어리'
};

const ALL_TYPES = ['노말', '불꽃', '물', '전기', '플', '얼음', '격투', '독', '땅', '비행', '에스퍼', '벌레', '바위', '고스트', '드래곤', '악', '강철', '페어리'];

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height?: number;
  weight?: number;
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities?: string[];
  species?: string;
  description?: string;
}

export default function DexPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pokemonDetail, setPokemonDetail] = useState<Pokemon | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const loadAllPokemons = async () => {
    setIsLoading(true);
    
    try {
      const pokemonIds = Array.from({length: MAX_POKEMON}, (_, i) => i + 1);
      
      const results = await Promise.all(
        pokemonIds.map(async (id) => {
          try {
            const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const detail = await detailRes.json();
            const speciesRes = await fetch(detail.species.url);
            const species = await speciesRes.json();
            const koreanName = species.names.find((n: any) => n.language.name === 'ko')?.name;

            return {
              id: detail.id,
              name: koreanName ?? detail.name,
              image: detail.sprites.other['official-artwork'].front_default,
              types: detail.types.map((t: any) => TYPE_KOR[t.type.name])
            };
          } catch (error) {
            console.error(`Failed to load pokemon ${id}:`, error);
            return null;
          }
        })
      );

      const validResults = results.filter((p): p is Pokemon => p !== null);
      validResults.sort((a, b) => a.id - b.id);
      
      setPokemons(validResults);
    }finally {
      setIsLoading(false);
    }
  };

  const loadPokemonDetail = async (pokemon: Pokemon) => {
    try {
      const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      const detail = await detailRes.json();
      const speciesRes = await fetch(detail.species.url);
      const species = await speciesRes.json();
      
      const koreanDescription = species.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'ko'
      )?.flavor_text || species.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      )?.flavor_text || '';

      const koreanAbilities = await Promise.all(
        detail.abilities.map(async (ability: any) => {
          try {
            const abilityRes = await fetch(ability.ability.url);
            const abilityDetail = await abilityRes.json();
            const koreanName = abilityDetail.names.find((n: any) => n.language.name === 'ko')?.name;
            return koreanName || ability.ability.name;
          } catch {
            return ability.ability.name;
          }
        })
      );

      const detailedPokemon: Pokemon = {
        ...pokemon,
        image: detail.sprites.versions['generation-v']['black-white'].animated?.front_default,
        height: detail.height / 10,
        weight: detail.weight / 10,
        stats: {
          hp: detail.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
          attack: detail.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0,
          defense: detail.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0,
          specialAttack: detail.stats.find((s: any) => s.stat.name === 'special-attack')?.base_stat || 0,
          specialDefense: detail.stats.find((s: any) => s.stat.name === 'special-defense')?.base_stat || 0,
          speed: detail.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 0,
        },
        abilities: koreanAbilities,
        description: koreanDescription.replace(/\f/g, ' ').replace(/\n/g, ' ')
      };

      setPokemonDetail(detailedPokemon);
    } catch (error) {
      console.error('Failed to load pokemon detail:', error);
      setPokemonDetail(pokemon);
    }
  };

  const handleCardClick = async (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
    setPokemonDetail(null);
    await loadPokemonDetail(pokemon);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
    setPokemonDetail(null);
  };

  useEffect(() => {
    loadAllPokemons();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleTypeClick = (type: string) => {
    setSelectedTypes(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(type)) {
        newSet.delete(type);
      } else if (newSet.size < 2) {
        newSet.add(type);
      } else {
        const firstType = Array.from(newSet)[0];
        newSet.delete(firstType);
        newSet.add(type);
      }
      
      return newSet;
    });
  };

  const handleAllTypesClick = () => {
    setSelectedTypes(new Set());
  };

  const filtered = useMemo(() => {
    return pokemons.filter(p => {
      const matchesSearch = p.name.includes(search) || p.types.some(t => t.includes(search));
      const matchesType = selectedTypes.size === 0 || 
        Array.from(selectedTypes).every(selectedType => p.types.includes(selectedType));
      return matchesSearch && matchesType;
    });
  }, [pokemons, search, selectedTypes]);

  const getCardListClass = () => {
    return 'few-cards';
  };

  return (
    <>
      <div className={styles.backgroundDexWrapper}></div>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.top}>
            <div className={styles.buttons}>
              <Logo className={styles.logo} onClick={handleLogoClick} />
              <div className={styles.subButtons}>
                <div className={styles.buttonWrapper} data-tooltip="도감">
                  <Button1 />
                </div>
                <div className={styles.buttonWrapper} data-tooltip="야생포켓몬 포획">
                  <Button2 />
                </div>
                <div className={styles.buttonWrapper} data-tooltip="커뮤니티">
                  <Button3 />
                </div>
                <div className={styles.buttonWrapper} data-tooltip="앨범">
                  <Button4 />
                </div>
                <div className={styles.buttonWrapper} data-tooltip="마이페이지">
                  <Button5 />
                </div>
              </div>
            </div>
            <div className={styles.searchframe}>
              <div className={styles.searchBox}>
                <div className={styles.inSearch}>
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <DeleteIcon className={styles.deleteIcon} onClick={() => setSearch('')} />
                </div>
              </div>
            </div>
            <div className={styles.ownedToggleFrame}>
              <div className={styles.ownedToggleLabel}>보유 포켓몬</div>
              <div 
                className={`${styles.toggleSwitch} ${showOwnedOnly ? styles.active : ''}`}
                onClick={() => setShowOwnedOnly(!showOwnedOnly)}
              >
                <div className={styles.toggleSlider}></div>
              </div>
            </div>
          </div>
          <div className={styles.board}>
            <div className={styles.typeFilter}>
              <button
                className={`${styles.typeButton} ${selectedTypes.size === 0 ? styles.selected : ''}`}
                onClick={handleAllTypesClick}
              >
                전체
              </button>
              {ALL_TYPES.map((type) => (
                <button
                  key={type}
                  className={`${styles.typeButton} ${selectedTypes.has(type) ? styles.selected : ''}`}
                  style={{ backgroundColor: TYPE_BOX_COLOR_MAP[type] }}
                  onClick={() => handleTypeClick(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <div ref={listRef} className={`${styles.cardList} ${styles[getCardListClass()]}`}>
              {isLoading ? (
                <div className={styles.loading}>포켓몬 도감을 불러오는 중... </div>
              ) : (
                filtered.map(({ id, name, types, image }) => {
                  const background = types.length === 1
                    ? TYPE_COLOR_MAP[types[0]]
                    : `linear-gradient(135deg, ${TYPE_COLOR_MAP[types[0]]} 30%, ${TYPE_COLOR_MAP[types[1]]} 100%)`;
                  return (
                    <div key={`pokemon-${id}`} className={styles.card} onClick={() => handleCardClick({ id, name, types, image })}>
                      <div className={styles.cardInner}>
                        <div className={styles.cardFront} style={{ background }}>
                          <div className={styles.innerCard}>
                            <div className={styles.imageWrapper}>
                              <img src={image} alt={name} />
                            </div>
                            <div className={styles.no}>No. {String(id).padStart(4, '0')}</div>
                            <div className={styles.name}>{name}</div>
                            <div className={styles.typeBox}>
                              {types.map((t, index) => (
                                <div
                                  key={`${id}-${t}-${index}`}
                                  className={styles.type}
                                  style={{ backgroundColor: TYPE_BOX_COLOR_MAP[t] }}
                                >
                                  {t}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className={styles.cardBack}>
                          <div className={styles.centerLine}></div>
                          <div className={styles.pokeBallContainer}>
                            <PokeBall />
                          </div>
                          <div className={styles.pokefaceLogoContainer}>
                            <PokefaceLogo />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedPokemon && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            
            <div 
              className={styles.modalHeader}
              style={{
                background: selectedPokemon.types.length === 1
                  ? TYPE_COLOR_MAP[selectedPokemon.types[0]]
                  : `linear-gradient(135deg, ${TYPE_COLOR_MAP[selectedPokemon.types[0]]} 30%, ${TYPE_COLOR_MAP[selectedPokemon.types[1]]} 100%)`
              }}
            >
              <div className={styles.modalImageWrapper}>
                <img src={pokemonDetail?.image || selectedPokemon.image} alt={selectedPokemon.name} />
              </div>
              <div className={styles.modalBasicInfo}>
                <h2 className={styles.modalPokemonName}>{selectedPokemon.name}</h2>
                <div className={styles.modalPokemonNo}>No. {String(selectedPokemon.id).padStart(4, '0')}</div>
                <div className={styles.modalTypeBox}>
                  {selectedPokemon.types.map((type, index) => (
                    <div
                      key={`modal-${type}-${index}`}
                      className={styles.modalType}
                      style={{ backgroundColor: TYPE_BOX_COLOR_MAP[type] }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalBody}>
              {pokemonDetail ? (
                <>
                  <div className={styles.modalSection}>
                    <h3>기본 정보</h3>
                    <div className={styles.modalInfoGrid}>
                      <div className={styles.modalInfoItem}>
                        <span className={styles.modalInfoLabel}>키:</span>
                        <span className={styles.modalInfoValue}>{pokemonDetail.height}m</span>
                      </div>
                      <div className={styles.modalInfoItem}>
                        <span className={styles.modalInfoLabel}>몸무게:</span>
                        <span className={styles.modalInfoValue}>{pokemonDetail.weight}kg</span>
                      </div>
                      {pokemonDetail.abilities && (
                        <div className={styles.modalInfoItem}>
                          <span className={styles.modalInfoLabel}>특성:</span>
                          <span className={styles.modalInfoValue}>{pokemonDetail.abilities.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {pokemonDetail.description && (
                    <div className={styles.modalSection}>
                      <h3>설명</h3>
                      <p className={styles.modalDescription}>{pokemonDetail.description}</p>
                    </div>
                  )}

                  {pokemonDetail.stats && (
                    <div className={styles.modalSection}>
                      <h3>종족값</h3>
                      <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>HP</span>
                          <div className={styles.statBar}>
                            <div 
                              className={styles.statFill} 
                              style={{ width: `${(pokemonDetail.stats.hp / 255) * 100}%` }}
                            ></div>
                          </div>
                          <span className={styles.statValue}>{pokemonDetail.stats.hp}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>공격</span>
                          <div className={styles.statBar}>
                            <div 
                              className={styles.statFill} 
                              style={{ width: `${(pokemonDetail.stats.attack / 255) * 100}%` }}
                            ></div>
                          </div>
                          <span className={styles.statValue}>{pokemonDetail.stats.attack}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>방어</span>
                          <div className={styles.statBar}>
                            <div 
                              className={styles.statFill} 
                              style={{ width: `${(pokemonDetail.stats.defense / 255) * 100}%` }}
                            ></div>
                          </div>
                          <span className={styles.statValue}>{pokemonDetail.stats.defense}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>특공</span>
                          <div className={styles.statBar}>
                            <div 
                              className={styles.statFill} 
                              style={{ width: `${(pokemonDetail.stats.specialAttack / 255) * 100}%` }}
                            ></div>
                          </div>
                          <span className={styles.statValue}>{pokemonDetail.stats.specialAttack}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>특방</span>
                          <div className={styles.statBar}>
                            <div 
                              className={styles.statFill} 
                              style={{ width: `${(pokemonDetail.stats.specialDefense / 255) * 100}%` }}
                            ></div>
                          </div>
                          <span className={styles.statValue}>{pokemonDetail.stats.specialDefense}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>스피드</span>
                          <div className={styles.statBar}>
                            <div 
                              className={styles.statFill} 
                              style={{ width: `${(pokemonDetail.stats.speed / 255) * 100}%` }}
                            ></div>
                          </div>
                          <span className={styles.statValue}>{pokemonDetail.stats.speed}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.modalLoading}>상세 정보를 불러오는 중...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}