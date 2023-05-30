import { useState } from "react";
import Header from "../../Header";
import { Container, Section, SectionParagragh, DownArrow, YtIcon, NewsIcon, BrIcon, UsIcon, RuleImg } from "./styles";
import { xp1, xp2, xp3, xp4, spell1, knight1, knight2, knight3, bishop1, bishop2, bishop3, rook1, rook2, queen1, queen2 } from "./pictures";

export default function HowToPlay() {
  const [selected, setSelected] = useState(-1);

  const openCloseSection = (index) => setSelected((selected != index) ? index : -1);

  return (
    <>
    <Header type="alternative" />
    <Container>
      <h1>How to play:</h1>
      <Section open={(selected == 0)} >
        <div onClick={() => openCloseSection(0)}>
          <h2>Regular Chess rules and version limitations</h2>
          <DownArrow  rotation={(selected == 0) ? "180" : "0" } />
        </div>
        { (selected != 0) ? <></> :
          <SectionParagragh>
            <p>Chess is a wonderful game but would be hard to explain it all in a few lines, you can learn all you need in the links below</p>
            <div>
              <div className="column">
                <p>Chess rules by:</p>
                <div id="us-icons-row">
                  <UsIcon />
                  <a href="https://www.chess.com/learn-how-to-play-chess" target="blank" ><NewsIcon /> Chess.com</a>
                  <a href="https://www.youtube.com/watch?v=OCSbzArwB10&pp=ygULY2hlc3MgcnVsZXM%3D" target="blank" ><YtIcon /> GothamChess</a>
                </div>
                <div>
                  <BrIcon />
                  <a href="https://www.chess.com/pt-BR/como-jogar-xadrez" target="blank" ><NewsIcon /> Chess.com</a>
                  <a href="https://www.youtube.com/watch?v=S1LsUT7jjDI" target="blank" ><YtIcon /> XadrezBrasil</a>
                </div>
              </div>
              <div className="column" >
                <p>Version limitations</p>
                <div>
                <span>
                  In this first version of Chess Arcane Dynasty all ties are going to be by agreement, 
                  bugs or errors may happen so please <a target="blank" href="mailto:chessarcanedynasty@gmail.com" >Contact us</a>
                </span>
                </div>
              </div>
            </div>
          </SectionParagragh>
        }
      </Section>
      <Section open={(selected == 1)} >
        <div onClick={() => openCloseSection(1)}>
          <h2>Earning xp and evolving</h2>
          <DownArrow  rotation={(selected == 1) ? "180" : "0" } />
        </div>
        { (selected != 1) ? <></> :
          <SectionParagragh>
            <p>
              Pieces gain xp when move or capture pieces (absorbing its xp) and evolve when reach their max xp
            </p>
            <div>
            <div className="column">
                <RuleImg size="36vh" src={xp1} alt="xp-1" />
              </div>
              <div className="column" >
                <RuleImg size="36vh" src={xp2} alt="xp-2" />
              </div>
              <div className="column" >
                <RuleImg size="36vh" src={xp3} alt="xp-3" />
              </div>
              <div className="column" >
                <RuleImg size="36vh" src={xp4} alt="xp-4" />
              </div>
            </div>
          </SectionParagragh>
        }
      </Section>
      <Section open={(selected == 2)} >
        <div onClick={() => openCloseSection(2)}>
          <h2>Using spells</h2>
          <DownArrow  rotation={(selected == 2) ? "180" : "0" } />
        </div>
        { (selected != 2) ? <></> :
          <SectionParagragh>
            <p>
              Using spells is simple: If your piece is evolved and has max xp
              you can use spells by activating 'spell' button and making your move
            </p>
            <div>
              <div className="column">
                <RuleImg size="36vh" src={spell1} alt="spell-1" />
              </div>
              <div className="column" >
                <RuleImg size="36vh" src={knight1} alt="spell-2" />
              </div>
            </div>
          </SectionParagragh>
        }
      </Section>
      <Section open={(selected == 3)} >
        <div onClick={() => openCloseSection(3)}>
          <h2>Knight - Pegasus spell</h2>
          <DownArrow  rotation={(selected == 3) ? "180" : "0" } />
        </div>
        { (selected != 3) ? <></> :
          <SectionParagragh>
            <p>
              Pegasus can fly for 2 moves by each side or until it moves again
              while flying pegasus can not be captured. Knights have a max xp of 4 points
            </p>
            <div>
            <div className="column">
                <RuleImg size="36vh" src={spell1} alt="knight-1" />
            </div>
            <div className="column">
                <RuleImg size="36vh" src={knight1} alt="knight-2" />
            </div>
            <div className="column" >
              <RuleImg size="36vh" src={knight2} alt="knight-3" />
            </div>
            <div className="column" >
              <RuleImg size="36vh" src={knight3} alt="knight-4" />
            </div>
            </div>
          </SectionParagragh>
        }
      </Section>
      <Section open={(selected == 4)} >
        <div onClick={() => openCloseSection(4)}>
          <h2>Bishop - Necromancer spell</h2>
          <DownArrow  rotation={(selected == 4) ? "180" : "0" } />
        </div>
        { (selected != 4) ? <></> :
          <SectionParagragh>
            <p>
              Necromancers leaves a zombie in its previous square,
              zombies can move and capture to the 3 squares in front of it, 
              zombies disappear on the summoner's second move after the spell.
              Bishops have a max xp of 4 points          
            </p>
            <div>
            <div className="column">
                <RuleImg size="36vh" src={bishop1} alt="bishop-1" />
            </div>
            <div className="column">
                <RuleImg size="36vh" src={bishop2} alt="bishop-2" />
            </div>
            <div className="column" >
              <RuleImg size="36vh" src={bishop3} alt="bishop-3" />
            </div>
            </div>
          </SectionParagragh>
        }
      </Section>
      <Section open={(selected == 5)} >
        <div onClick={() => openCloseSection(5)}>
          <h2>Rook - Cannon spell</h2>
          <DownArrow  rotation={(selected == 5) ? "180" : "0" } />
        </div>
        { (selected != 5) ? <></> :
          <SectionParagragh>
            <p>
              Cannons can explode squares without moving, breaking the target square
              and capturing the piece on it, pieces cannot move through or onto broken tiles,
              the tile will recover on the shooter's second move after the spell.
              Rooks have a max xp of 6 points       
            </p>
            <div>
              <div className="column">
                  <RuleImg size="36vh" src={rook1} alt="rook-1" />
              </div>
              <div className="column">
                  <RuleImg size="36vh" src={rook2} alt="rook-2" />
              </div>
            </div>
          </SectionParagragh>
        }
      </Section>
      <Section open={(selected == 6)} >
        <div onClick={() => openCloseSection(6)}>
          <h2>Queen - Paladin spell</h2>
          <DownArrow  rotation={(selected == 6) ? "180" : "0" } />
        </div>
        { (selected != 6) ? <></> :
          <SectionParagragh>
            <p>
              Paladins can fill xp of all pieces other than queens. 
              Queens have a max xp of 8 points         
            </p>
            <div>
              <div className="column">
                  <RuleImg size="36vh" src={rook1} alt="rook-1" />
              </div>
              <div className="column">
                  <RuleImg size="36vh" src={rook2} alt="rook-2" />
              </div>
            </div>
          </SectionParagragh>
        }
      </Section>
    </Container>
    </>
  )
};
