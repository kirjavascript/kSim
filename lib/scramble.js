/*

scramble_333.js

3x3x3 Solver / Scramble Generator in Javascript.

The core 3x3x3 code is from a min2phase solver by Shuang Chen.
Compiled to Javascript using GWT.
(There may be a lot of redundant code right now, but it's still really fast.)

*/

if (typeof scramblers === "undefined") {
    var scramblers = {}
}

var search;

scramblers["333fm"] = scramblers["333ft"] = scramblers["333bf"] = scramblers["333oh"] = scramblers["333"] = (function() {
    function av() {}

    function a6(bS, bR) {
        var bP, bQ;
        bP = Array(bS);
        for (bQ = 0; bQ < bS; bP[bQ++] = Array(bR)) {}
        return bP
    }

    function aE() {
        aE = av;
        bp = a6(495, 18);
        q = a6(324, 18);
        aC = a6(336, 18);
        U = a6(495, 8);
        ap = Array(160380);
        az = Array(166320);
        bd = Array(870912);
        aJ = a6(1320, 18);
        am = Array(24);
        Y = Array(346);
        a2 = a6(2768, 18);
        L = a6(2768, 10);
        bs = a6(24, 10);
        aa = a6(24, 16);
        ay = Array(66432);
        f = Array(66432)
    }

    function ax() {
        var bP;
        for (bP = 0; bP < 346; ++bP) {
            Y[bP] = 0
        }
        for (bP = 0; bP < 2768; ++bP) {
            Y[bP >>> 3] = (Y[bP >>> 3] | aV((ag)[bP]) << (bP & 7))
        }
    }

    function bq() {
        var bS, bR, bQ, bP;
        bS = new ab;
        bR = new ab;
        for (bQ = 0; bQ < 2768; ++bQ) {
            bm(bS.cp, (ag)[bQ]);
            for (bP = 0; bP < 18; ++bP) {
                r(bS, a[bP], bR);
                a2[bQ][bP] = aZ(bR)
            }
        }
    }

    function aN() {
        var bS, bR, bQ, bP;
        bS = new ab;
        bR = new ab;
        for (bQ = 0; bQ < 2768; ++bQ) {
            bm(bS.ep, (bH)[bQ]);
            for (bP = 0; bP < 10; ++bP) {
                a7(bS, a[aS[bP]], bR);
                L[bQ][bP] = E(bR)
            }
        }
    }

    function bw() {
        var bS, bR, bQ, bP;
        bS = new ab;
        bR = new ab;
        for (bQ = 0; bQ < 336; ++bQ) {
            bB(bS, (an)[bQ]);
            for (bP = 0; bP < 18; ++bP) {
                a7(bS, a[bP], bR);
                aC[bQ][bP] = au(bR)
            }
        }
    }

    function a0(bR) {
        var bV, b8, b7, b0, bX, b6, ca, bY, bT, bQ, b4, bW, bS, bP, b3, b1, b9, b5, b2, bU, bZ;
        b8 = new ab;
        b6 = new ab;
        ca = 0;
        bY = 1;
        bV = Array(2768);
        for (b4 = 0; b4 < 2768; ++b4) {
            bV[b4] = 0;
            bm(b8.ep, (bH)[b4]);
            for (b3 = 1; b3 < 16; ++b3) {
                a7(aM[aD[b3]], b8, H);
                a7(H, aM[b3], b6);
                be(bH, M(b6.ep)) != 65535 && (bV[b4] = (bV[b4] | 1 << b3))
            }
        }
        for (b4 = 0; b4 < 66432; ++b4) {
            f[b4] = -1
        }
        f[0] = 0;
        while (bY < 66432) {
            bP = ca > 7;
            b2 = bP ? -1 : ca;
            b7 = bP ? ca : -1;
            ++ca;
            for (b4 = 0; b4 < 66432; ++b4) {
                if (f[b4] === b2) {
                    b9 = b4 % 24;
                    bT = ~~(b4 / 24);
                    for (b1 = 0; b1 < 10; ++b1) {
                        bQ = L[bT][b1];
                        bZ = bQ & 15;
                        b5 = aa[bs[b9][b1]][bZ];
                        bQ >>>= 4;
                        bW = bQ * 24 + b5;
                        if (f[bW] === b7) {
                            ++bY;
                            if (bP) {
                                f[b4] = ca;
                                break
                            } else {
                                f[bW] = ca;
                                bU = bV[bQ];
                                if (bU != 0) {
                                    for (b3 = 1; b3 < 16; ++b3) {
                                        bU = bU >> 1;
                                        if ((bU & 1) === 1) {
                                            bS = bQ * 24 + aa[b5][b3];
                                            if (f[bS] === -1) {
                                                f[bS] = ca;
                                                ++bY
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            bR("MEPermPrun: " + (Math.floor(bY * 100 / 66432)) + "% (" + bY + "/66432)")
        }
        for (b4 = 0; b4 < 66432; ++b4) {
            ay[b4] = -1
        }
        ay[0] = 0;
        ca = 0;
        bY = 1;
        while (bY < 66432) {
            bP = ca > 7;
            b2 = bP ? -1 : ca;
            b7 = bP ? ca : -1;
            ++ca;
            for (b4 = 0; b4 < 66432; ++b4) {
                if (ay[b4] === b2) {
                    b9 = b4 % 24;
                    b0 = ~~(b4 / 24);
                    for (b1 = 0; b1 < 10; ++b1) {
                        bX = a2[b0][aS[b1]];
                        bZ = (bX & 15);
                        b5 = aa[bs[b9][b1]][bZ];
                        bX = bX >>> 4;
                        bW = bX * 24 + b5;
                        if (ay[bW] === b7) {
                            ++bY;
                            if (bP) {
                                ay[b4] = ca;
                                break
                            } else {
                                ay[bW] = ca;
                                bU = bV[bX];
                                if (bU != 0) {
                                    for (b3 = 1; b3 < 16; ++b3) {
                                        bU = bU >> 1;
                                        if ((bU & 1) === 1) {
                                            bS = bX * 24 + aa[b5][b3 ^ (Q)[b3]];
                                            if (ay[bS] === -1) {
                                                ay[bS] = ca;
                                                ++bY
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            bR("MCPermPrun: " + (Math.floor(bY * 100 / 66432)) + "% (" + bY + "/66432)")
        }
    }

    function aO() {
        var bS, bR, bQ, bP;
        bS = new ab;
        bR = new ab;
        for (bQ = 0; bQ < 24; ++bQ) {
            aT(bS, bQ);
            for (bP = 0; bP < 16; ++bP) {
                e(bS, aD[bP], bR);
                aa[bQ][bP] = c(bR)
            }
        }
    }

    function m() {
        var bS, bR, bQ, bP;
        bS = new ab;
        bR = new ab;
        for (bQ = 0; bQ < 24; ++bQ) {
            aT(bS, bQ);
            for (bP = 0; bP < 10; ++bP) {
                a7(bS, a[aS[bP]], bR);
                bs[bQ][bP] = c(bR)
            }
        }
    }

    function aW() {
        var bQ, bP;
        bQ = new ab;
        for (bP = 0; bP < 24; ++bP) {
            aT(bQ, bP);
            am[bj(bQ) % 24] = bP
        }
    }

    function bD() {
        var bS, bR, bQ, bP;
        bS = new ab;
        bR = new ab;
        for (bQ = 0; bQ < 1320; ++bQ) {
            aI(bS, bQ);
            for (bP = 0; bP < 18; ++bP) {
                a7(bS, a[bP], bR);
                aJ[bQ][bP] = bj(bR)
            }
        }
    }

    function bv(bT) {
        var bX, cf, ce, cd, cc, cg, b0, bV, b6, b7, bY, bQ, ca, bZ, bU, bP, b9, b8, b2, b3, b5, ch, bW, b4, b1, bS, bR, cb;
        bX = Array(324);
        ce = new ab;
        cc = new ab;
        for (ca = 0; ca < 324; ++ca) {
            bX[ca] = 0;
            bJ(ce, br[ca]);
            for (b9 = 0; b9 < 8; ++b9) {
                B(aM[aD[b9 << 1]], ce, H);
                B(H, aM[b9 << 1], cc);
                be(br, ah(cc)) != 65535 && (bX[ca] = bX[ca] | (1 << b9))
            }
        }
        cf = Array(336);
        for (ca = 0; ca < 336; ++ca) {
            cf[ca] = 0;
            bB(ce, (an)[ca]);
            for (b9 = 0; b9 < 8; ++b9) {
                a7(aM[aD[b9 << 1]], ce, H);
                a7(H, aM[b9 << 1], cc);
                be(an, C(cc)) != 65535 && (cf[ca] = cf[ca] | (1 << b9))
            }
        }
        for (ca = 0; ca < 870912; ++ca) {
            bd[ca] = -1
        }
        for (ca = 0; ca < 8; ++ca) {
            bd[ca] = 0
        }
        cg = 0;
        b0 = 8;
        while (b0 < 870912) {
            bP = cg > 6;
            b3 = bP ? -1 : cg;
            cd = bP ? cg : -1;
            ++cg;
            for (ca = 0; ca < 870912; ++ca) {
                if (bd[ca] != b3) {
                    continue
                }
                bR = ~~(ca / 2688);
                bV = ca % 2688;
                b7 = ca & 7;
                bV >>>= 3;
                for (b2 = 0; b2 < 18; ++b2) {
                    cb = q[bR][b2];
                    bS = cb & 7;
                    cb >>>= 3;
                    b6 = aC[bV][bF[b7][b2]];
                    bY = aG[a3[b6 & 7][b7]][bS];
                    b6 >>>= 3;
                    bZ = cb * 2688 + (b6 << 3 | bY);
                    if (bd[bZ] === cd) {
                        ++b0;
                        if (bP) {
                            bd[ca] = cg;
                            break
                        } else {
                            bd[bZ] = cg;
                            bW = bX[cb];
                            b4 = cf[b6];
                            if (bW != 1 || b4 != 1) {
                                for (b9 = 0; b9 < 8; ++b9, b4 = b4 >> 1) {
                                    if ((b4 & 1) === 1) {
                                        bQ = aG[bY][b9];
                                        for (b8 = 0; b8 < 8; ++b8) {
                                            if ((bW & 1 << b8) != 0) {
                                                bU = cb * 2688 + (b6 << 3 | aG[bQ][b8]);
                                                if (bd[bU] === -1) {
                                                    bd[bU] = cg;
                                                    ++b0
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            bT("TwistFlipPrun: " + (Math.floor(b0 * 100 / 870912)) + "% (" + b0 + "/870912)")
        }
        for (ca = 0; ca < 160380; ++ca) {
            ap[ca] = -1
        }
        ap[0] = 0;
        cg = 0;
        b0 = 1;
        while (b0 < 160380) {
            bP = cg > 6;
            b3 = bP ? -1 : cg;
            cd = bP ? cg : -1;
            ++cg;
            for (ca = 0; ca < 160380; ++ca) {
                if (ap[ca] === b3) {
                    b5 = ca % 495;
                    bR = ~~(ca / 495);
                    for (b2 = 0; b2 < 18; ++b2) {
                        cb = q[bR][b2];
                        b1 = cb & 7;
                        ch = U[bp[b5][b2]][b1];
                        cb >>>= 3;
                        bZ = cb * 495 + ch;
                        if (ap[bZ] === cd) {
                            ++b0;
                            if (bP) {
                                ap[ca] = cg;
                                break
                            } else {
                                ap[bZ] = cg;
                                bW = bX[cb];
                                if (bW != 1) {
                                    for (b9 = 1; b9 < 8; ++b9) {
                                        bW = bW >> 1;
                                        if ((bW & 1) === 1) {
                                            bU = cb * 495 + U[ch][b9];
                                            if (ap[bU] === -1) {
                                                ap[bU] = cg;
                                                ++b0
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            bT("UDSliceTwistPrun: " + (Math.floor(b0 * 100 / 160380)) + "% (" + b0 + "/160380)")
        }
        for (ca = 0; ca < 166320; ++ca) {
            az[ca] = -1
        }
        az[0] = 0;
        cg = 0;
        b0 = 1;
        while (b0 < 166320) {
            bP = cg > 6;
            b3 = bP ? -1 : cg;
            cd = bP ? cg : -1;
            ++cg;
            for (ca = 0; ca < 166320; ++ca) {
                if (az[ca] === b3) {
                    b5 = ca % 495;
                    bV = ~~(ca / 495);
                    for (b2 = 0; b2 < 18; ++b2) {
                        b6 = aC[bV][b2];
                        b1 = b6 & 7;
                        ch = U[bp[b5][b2]][b1];
                        b6 >>>= 3;
                        bZ = b6 * 495 + ch;
                        if (az[bZ] === cd) {
                            ++b0;
                            if (bP) {
                                az[ca] = cg;
                                break
                            } else {
                                az[bZ] = cg;
                                bW = cf[b6];
                                if (bW != 1) {
                                    for (b9 = 1; b9 < 8; ++b9) {
                                        bW = bW >> 1;
                                        if ((bW & 1) === 1) {
                                            bU = b6 * 495 + U[ch][b9];
                                            if (az[bU] === -1) {
                                                az[bU] = cg;
                                                ++b0
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            bT("UDSliceFlipPrun: " + (Math.floor(b0 * 100 / 166320)) + "% (" + b0 + "/166320)")
        }
    }

    function V() {
        var bS, bR, bQ, bP;
        bS = new ab;
        bR = new ab;
        for (bQ = 0; bQ < 324; ++bQ) {
            bJ(bS, br[bQ]);
            for (bP = 0; bP < 18; ++bP) {
                r(bS, a[bP], bR);
                q[bQ][bP] = u(bR)
            }
        }
    }

    function bM() {
        var bS, bR, bQ, bP;
        bS = new ab;
        bR = new ab;
        for (bQ = 0; bQ < 495; ++bQ) {
            bx(bS, bQ);
            for (bP = 0; bP < 16; bP = bP + 2) {
                e(bS, (aD)[bP], bR);
                U[bQ][bP >>> 1] = bc(bR)
            }
        }
    }

    function aH() {
        var bS, bR, bQ, bP;
        bS = new ab;
        bR = new ab;
        for (bQ = 0; bQ < 495; ++bQ) {
            bx(bS, bQ);
            for (bP = 0; bP < 18; ++bP) {
                a7(bS, a[bP], bR);
                bp[bQ][bP] = bc(bR)
            }
        }
    }
    var Y, a2, L, aC, ay, f, aa, bs, am, aJ, bd, q, U, az, bp, ap;

    function bI() {
        bI = av;
        H = new ab;
        aM = Array(16);
        aD = Array(16);
        a9 = a6(16, 16);
        bL = a6(16, 18);
        a3 = a6(8, 8);
        bF = a6(8, 18);
        aG = a6(8, 8);
        aY = a6(16, 10);
        an = Array(336);
        br = Array(324);
        ag = Array(2768);
        bH = ag;
        v = Array(40320);
        aF = a6(56, 56);
        Q = [0, 0, 0, 0, 1, 3, 1, 3, 1, 3, 1, 3, 0, 0, 0, 0];
        bG = new X(2531, 1373, 67026819, 1877);
        bE = new X(2089, 1906, 322752913, 255);
        aj = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            [6, 7, 8, 0, 1, 2, 3, 4, 5, 15, 16, 17, 9, 10, 11, 12, 13, 14],
            [3, 4, 5, 6, 7, 8, 0, 1, 2, 12, 13, 14, 15, 16, 17, 9, 10, 11],
            [2, 1, 0, 5, 4, 3, 8, 7, 6, 11, 10, 9, 14, 13, 12, 17, 16, 15],
            [8, 7, 6, 2, 1, 0, 5, 4, 3, 17, 16, 15, 11, 10, 9, 14, 13, 12],
            [5, 4, 3, 8, 7, 6, 2, 1, 0, 14, 13, 12, 17, 16, 15, 11, 10, 9]
        ];
        bh();
        J()
    }

    function o(bP) {
        bP.cp = [0, 1, 2, 3, 4, 5, 6, 7];
        bP.co = [0, 0, 0, 0, 0, 0, 0, 0];
        bP.ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        bP.eo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    function ar(bQ, bR) {
        var bP;
        for (bP = 0; bP < 8; ++bP) {
            bQ.cp[bP] = bR.cp[bP];
            bQ.co[bP] = bR.co[bP]
        }
        for (bP = 0; bP < 12; ++bP) {
            bQ.ep[bP] = bR.ep[bP];
            bQ.eo[bP] = bR.eo[bP]
        }
    }

    function aZ(bR) {
        var bP, bQ;
        if (aw != null) {
            bP = aw[M(bR.cp)];
            bP = (bP ^ Q[bP & 15]);
            return bP
        }
        for (bQ = 0; bQ < 16; ++bQ) {
            aL(bR, aD[bQ], bR.temps);
            bP = be(ag, M(bR.temps.cp));
            if (bP != 65535) {
                return (bP << 4 | bQ)
            }
        }
        return 0
    }

    function P(bU) {
        var bR, bV, bT, bP, bS, bQ;
        bV = 0;
        bT = 0;
        bP = 0;
        bS = 3;
        for (bR = 11; bR >= 0; --bR) {
            if (4 <= bU.ep[bR] && bU.ep[bR] <= 6) {
                bV = bV + (bb)[bR][bS--];
                bQ = 1 << bU.ep[bR];
                bT = bT + ao(bP & bQ - 1) * aq[2 - bS];
                bP = (bP | bQ)
            }
        }
        return bV * 6 + bT
    }

    function E(bR) {
        var bP, bQ;
        if (aw != null) {
            return aw[M(bR.ep)]
        }
        for (bQ = 0; bQ < 16; ++bQ) {
            e(bR, aD[bQ], bR.temps);
            bP = be(bH, M(bR.temps.ep));
            if (bP != 65535) {
                return (bP << 4 | bQ)
            }
        }
        return 0
    }

    function j(bT) {
        var bS, bP, bQ, bR;
        bQ = 1 << bT.ep[11];
        bP = 0;
        for (bS = 10; bS >= 0; --bS) {
            bR = 1 << bT.ep[bS];
            bP += ao(bQ & bR - 1) * (aq)[11 - bS];
            bQ |= bR
        }
        return bP
    }

    function C(bR) {
        var bQ, bP;
        bP = 0;
        for (bQ = 0; bQ < 11; ++bQ) {
            bP = (bP | bR.eo[bQ] << bQ)
        }
        return bP
    }

    function au(bR) {
        var bP, bQ;
        if (by != null) {
            return by[C(bR)]
        }
        for (bQ = 0; bQ < 16; bQ = bQ + 2) {
            e(bR, aD[bQ], bR.temps);
            bP = be(an, C(bR.temps));
            if (bP != 65535) {
                return (bP << 3 | bQ >>> 1)
            }
        }
        return 0
    }

    function c(bT) {
        var bS, bP, bQ, bR;
        bQ = 1 << bT.ep[11];
        bP = 0;
        for (bS = 10; bS >= 8; --bS) {
            bR = 1 << bT.ep[bS];
            bP += ao(bQ & bR - 1) * (aq)[11 - bS];
            bQ |= bR
        }
        return bP
    }

    function bj(bU) {
        var bR, bV, bT, bP, bS, bQ;
        bV = 0;
        bT = 0;
        bP = 0;
        bS = 3;
        for (bR = 11; bR >= 0; --bR) {
            if (bU.ep[bR] >= 9) {
                bV = bV + (bb)[bR][bS--];
                bQ = 1 << bU.ep[bR];
                bT = bT + ao(bP & bQ - 1) * aq[2 - bS];
                bP = (bP | bQ)
            }
        }
        return bV * 6 + bT
    }

    function ah(bR) {
        var bQ, bP;
        bP = 0;
        for (bQ = 0; bQ < 7; ++bQ) {
            bP = bP * 3;
            bP = bP + bR.co[bQ]
        }
        return bP
    }

    function u(bR) {
        var bP, bQ;
        if (ai != null) {
            return ai[ah(bR)]
        }
        for (bQ = 0; bQ < 16; bQ = bQ + 2) {
            aL(bR, aD[bQ], bR.temps);
            bP = ah(bR.temps);
            bP = be(br, bP);
            if (bP != 65535) {
                return (bP << 3 | bQ >>> 1)
            }
        }
        return 0
    }

    function bc(bS) {
        var bQ, bP, bR;
        bP = 0;
        bR = 4;
        for (bQ = 0; bQ < 12; ++bQ) {
            bS.ep[bQ] >= 8 && (bP = bP + (bb)[11 - bQ][bR--])
        }
        return bP
    }

    function F(bU) {
        var bR, bV, bT, bP, bS, bQ;
        bV = 0;
        bT = 0;
        bP = 0;
        bS = 3;
        for (bR = 11; bR >= 0; --bR) {
            if (bU.ep[bR] <= 2) {
                bV = bV + (bb)[bR][bS--];
                bQ = 1 << bU.ep[bR];
                bT = bT + ao(bP & bQ - 1) * aq[2 - bS];
                bP = (bP | bQ)
            }
        }
        return bV * 6 + bT
    }

    function bK(bS) {
        var bP, bQ, bR;
        for (bQ = 0; bQ < 12; ++bQ) {
            bS.temps.ep[bS.ep[bQ]] = bQ
        }
        for (bQ = 0; bQ < 12; ++bQ) {
            bS.temps.eo[bQ] = bS.eo[bS.temps.ep[bQ]]
        }
        for (bP = 0; bP < 8; ++bP) {
            bS.temps.cp[bS.cp[bP]] = bP
        }
        for (bP = 0; bP < 8; ++bP) {
            bR = bS.co[bS.temps.cp[bP]];
            bS.temps.co[bP] = -bR;
            bS.temps.co[bP] < 0 && (bS.temps.co[bP] = bS.temps.co[bP] + 3)
        }
        ar(bS, bS.temps)
    }

    function bO(bS, bP) {
        var bR, bQ;
        bS.ep[11] = 0;
        for (bR = 10; bR >= 0; --bR) {
            bS.ep[bR] = bP % (12 - bR);
            bP = ~~(bP / (12 - bR));
            for (bQ = bR + 1; bQ < 12; ++bQ) {
                bS.ep[bQ] >= bS.ep[bR] && ++bS.ep[bQ]
            }
        }
    }

    function bB(bR, bP) {
        var bQ;
        bR.eo[11] = G(bP);
        for (bQ = 0; bQ < 11; ++bQ) {
            bR.eo[bQ] = (bP & 1);
            bP = bP >>> 1
        }
    }

    function aT(bS, bP) {
        var bR, bQ;
        bS.ep[11] = 8;
        for (bR = 10; bR >= 8; --bR) {
            bS.ep[bR] = bP % (12 - bR) + 8;
            bP = ~~(bP / (12 - bR));
            for (bQ = bR + 1; bQ < 12; ++bQ) {
                bS.ep[bQ] >= bS.ep[bR] && ++bS.ep[bQ]
            }
        }
    }

    function aI(bS, bT) {
        var bR, bP, bQ;
        bR = (S)[bT % 6];
        bT = ~~(bT / 6);
        bQ = 3;
        for (bP = 11; bP >= 0; --bP) {
            if (bT >= bb[bP][bQ]) {
                bT = bT - bb[bP][bQ--];
                bS.ep[bP] = bR[2 - bQ]
            } else {
                bS.ep[bP] = 8 - bP + bQ
            }
        }
    }

    function bJ(bS, bP) {
        var bR, bQ;
        bQ = 0;
        for (bR = 6; bR >= 0; --bR) {
            bQ = bQ + (bS.co[bR] = bP % 3);
            bP = ~~(bP / 3)
        }
        bS.co[7] = (15 - bQ) % 3
    }

    function bx(bS, bP) {
        var bQ, bR;
        bR = 4;
        for (bQ = 0; bQ < 12; ++bQ) {
            if (bP >= (bb)[11 - bQ][bR]) {
                bP = bP - bb[11 - bQ][bR--];
                bS.ep[bQ] = 11 - bR
            } else {
                bS.ep[bQ] = bQ + bR - 4
            }
        }
    }

    function bi(bT) {
        var bV, bS, bR, bU, bP, bQ;
        bQ = 0;
        bU = 0;
        for (bR = 0; bR < 12; ++bR) {
            bU = (bU | 1 << bT.ep[bR])
        }
        if (bU != 4095) {
            return -2
        }
        for (bP = 0; bP < 12; ++bP) {
            bQ = bQ ^ bT.eo[bP]
        }
        if (bQ % 2 != 0) {
            return -3
        }
        bS = 0;
        for (bV = 0; bV < 8; ++bV) {
            bS = (bS | 1 << bT.cp[bV])
        }
        if (bS != 255) {
            return -4
        }
        bQ = 0;
        for (bP = 0; bP < 8; ++bP) {
            bQ = bQ + bT.co[bP]
        }
        if (bQ % 3 != 0) {
            return -5
        }
        if ((K(j(bT)) ^ aV(M(bT.cp))) != 0) {
            return -6
        }
        return 0
    }

    function aL(bR, bQ, bP) {
        B(aM[aD[bQ]], bR, H);
        B(H, aM[bQ], bP)
    }

    function r(bR, bQ, bP) {
        var bS;
        for (bS = 0; bS < 8; ++bS) {
            bP.cp[bS] = bR.cp[bQ.cp[bS]];
            bP.co[bS] = (bR.co[bQ.cp[bS]] + bQ.co[bS]) % 3
        }
    }

    function B(bR, bQ, bP) {
        var bT, bV, bU, bS;
        for (bT = 0; bT < 8; ++bT) {
            bP.cp[bT] = bR.cp[bQ.cp[bT]];
            bU = bR.co[bQ.cp[bT]];
            bS = bQ.co[bT];
            bV = bU;
            bV = bV + (bU < 3 ? bS : 3 - bS);
            bV = bV % 3;
            bU < 3 ^ bS < 3 && (bV = bV + 3);
            bP.co[bT] = bV
        }
    }

    function ab() {
        o(this)
    }

    function Z(bS, bT, bP, bQ) {
        var bR;
        o(this);
        for (bR = 0; bR < 8; ++bR) {
            this.cp[bR] = bS[bR];
            this.co[bR] = bT[bR]
        }
        for (bR = 0; bR < 12; ++bR) {
            this.ep[bR] = bP[bR];
            this.eo[bR] = bQ[bR]
        }
    }

    function X(bP, bS, bQ, bR) {
        o(this);
        bm(this.cp, bP);
        bJ(this, bS);
        bO(this, bQ);
        bB(this, bR)
    }

    function W(bP) {
        Z.call(this, bP.cp, bP.co, bP.ep, bP.eo)
    }

    function e(bR, bQ, bP) {
        a7(aM[aD[bQ]], bR, H);
        a7(H, aM[bQ], bP)
    }

    function a7(bR, bQ, bP) {
        var bS;
        for (bS = 0; bS < 12; ++bS) {
            bP.ep[bS] = bR.ep[bQ.ep[bS]];
            bP.eo[bS] = (bQ.eo[bS] ^ bR.eo[bQ.ep[bS]])
        }
    }

    function M(bQ) {
        var bS, bP, bR, bT;
        bP = 0;
        bT = 1985229328;
        for (bS = 0; bS < 7; ++bS) {
            bR = bQ[bS] << 2;
            bP = (8 - bS) * bP + (bT >> bR & 7);
            bT -= 286331152 << bR
        }
        return bP
    }

    function bh() {
        var bP, bR, bQ;
        bR = Array(18);
        a = [new X(15120, 0, 119750400, 0), new X(21021, 1494, 323403417, 0), new X(8064, 1236, 29441808, 802), new X(9, 0, 5880, 0), new X(1230, 412, 2949660, 0), new X(224, 137, 328552, 1160)];
        for (bP = 0; bP < 6; ++bP) {
            bR[bP * 3] = a[bP];
            for (bQ = 0; bQ < 2; ++bQ) {
                bR[bP * 3 + bQ + 1] = new ab;
                a7(bR[bP * 3 + bQ], a[bP], bR[bP * 3 + bQ + 1]);
                r(bR[bP * 3 + bQ], a[bP], bR[bP * 3 + bQ + 1])
            }
        }
        a = bR
    }

    function J() {
        var bX, bV, bQ, bT, bS, bR, bW, bU, bZ, bY, bP;
        bX = new ab;
        bV = new ab;
        bQ = new X(28783, 0, 259268407, 0);
        bP = new X(15138, 0, 119765538, 1792);
        bW = new X(5167, 0, 83473207, 0);
        bW.co = [3, 3, 3, 3, 3, 3, 3, 3];
        for (bT = 0; bT < 16; ++bT) {
            aM[bT] = new W(bX);
            B(bX, bP, bV);
            a7(bX, bP, bV);
            bY = bV;
            bV = bX;
            bX = bY;
            if (bT % 4 === 3) {
                B(bY, bW, bV);
                a7(bY, bW, bV);
                bY = bV;
                bV = bX;
                bX = bY
            }
            if (bT % 8 === 7) {
                B(bY, bQ, bV);
                a7(bY, bQ, bV);
                bY = bV;
                bV = bX;
                bX = bY
            }
        }
        for (bS = 0; bS < 16; ++bS) {
            for (bR = 0; bR < 16; ++bR) {
                B(aM[bS], aM[bR], bX);
                if (bX.cp[0] === 0 && bX.cp[1] === 1 && bX.cp[2] === 2) {
                    aD[bS] = bR;
                    break
                }
            }
        }
        for (bT = 0; bT < 16; ++bT) {
            for (bS = 0; bS < 16; ++bS) {
                B(aM[bT], aM[bS], bX);
                for (bR = 0; bR < 16; ++bR) {
                    if (aM[bR].cp[0] === bX.cp[0] && aM[bR].cp[1] === bX.cp[1] && aM[bR].cp[2] === bX.cp[2]) {
                        a9[bT][bS] = bR;
                        break
                    }
                }
            }
        }
        for (bS = 0; bS < 18; ++bS) {
            for (bZ = 0; bZ < 16; ++bZ) {
                aL(a[bS], aD[bZ], bX);
                CONTINUE: for (bU = 0; bU < 18; ++bU) {
                    for (bT = 0; bT < 8; ++bT) {
                        if (bX.cp[bT] != a[bU].cp[bT] || bX.co[bT] != a[bU].co[bT]) {
                            continue CONTINUE
                        }
                    }
                    bL[bZ][bS] = bU
                }
            }
        }
        for (bS = 0; bS < 10; ++bS) {
            for (bZ = 0; bZ < 16; ++bZ) {
                aY[bZ][bS] = (at)[bL[bZ][aS[bS]]]
            }
        }
        for (bS = 0; bS < 8; ++bS) {
            for (bZ = 0; bZ < 8; ++bZ) {
                a3[bZ][bS] = a9[bZ << 1][bS << 1] >>> 1
            }
        }
        for (bS = 0; bS < 18; ++bS) {
            for (bZ = 0; bZ < 8; ++bZ) {
                bF[bZ][bS] = bL[bZ << 1][bS]
            }
        }
        for (bS = 0; bS < 8; ++bS) {
            for (bZ = 0; bZ < 8; ++bZ) {
                aG[bS][bZ] = a3[bS][aD[bZ << 1] >> 1]
            }
        }
    }

    function a5() {
        var bX, bW, bV, bT, bU, bR, bY, bQ, bS, b0, bP, bZ;
        bV = new ab;
        bU = new ab;
        bP = Array(1260);
        bT = 0;
        for (bR = 0; bR < 64; bP[bR++] = 0) {}
        for (bR = 0; bR < 2048; ++bR) {
            if ((bP[bR >>> 5] & 1 << (bR & 31)) === 0) {
                bB(bV, bR);
                for (bZ = 0; bZ < 16; bZ = bZ + 2) {
                    a7(aM[aD[bZ]], bV, H);
                    a7(H, aM[bZ], bU);
                    bY = C(bU);
                    bP[bY >>> 5] |= 1 << (bY & 31);
                    by[bY] = (bT << 3 | bZ >>> 1)
                }
                an[bT++] = bR
            }
        }
        bT = 0;
        for (bR = 0; bR < 69; bP[bR++] = 0) {}
        for (bR = 0; bR < 2187; ++bR) {
            if ((bP[bR >>> 5] & 1 << (bR & 31)) === 0) {
                bJ(bV, bR);
                for (bZ = 0; bZ < 16; bZ = bZ + 2) {
                    B(aM[aD[bZ]], bV, H);
                    B(H, aM[bZ], bU);
                    bY = ah(bU);
                    bP[bY >>> 5] |= 1 << (bY & 31);
                    ai[bY] = (bT << 3 | bZ >>> 1)
                }
                br[bT++] = bR
            }
        }
        b0 = Array(2);
        b0[0] = Array(56);
        b0[1] = Array(56);
        for (bR = 0; bR < 56; ++bR) {
            b0[0][bR] = b0[1][bR] = 0
        }
        for (bR = 0; bR < 40320; ++bR) {
            bm(bV.ep, bR);
            bX = ~~(F(bV) / 6);
            bW = ~~(P(bV) / 6);
            b0[bW >> 5][bX] |= 1 << (bW & 31)
        }
        for (bR = 0; bR < 56; ++bR) {
            bT = 0;
            for (bQ = 0; bQ < 56; ++bQ) {
                ((b0[bQ >> 5][bR] & (1 << (bQ & 31))) != 0) && (aF[bR][bQ] = bT++)
            }
        }
        bT = 0;
        for (bR = 0; bR < 1260; bP[bR++] = 0) {}
        for (bR = 0; bR < 40320; ++bR) {
            if ((bP[bR >>> 5] & 1 << (bR & 31)) === 0) {
                bm(bV.ep, bR);
                for (bZ = 0; bZ < 16; ++bZ) {
                    a7(aM[aD[bZ]], bV, H);
                    a7(H, aM[bZ], bU);
                    bY = M(bU.ep);
                    bP[bY >>> 5] |= 1 << (bY & 31);
                    bX = F(bU);
                    bW = P(bU);
                    bS = aF[~~(bX / 6)][~~(bW / 6)] * 4032 + bX * 12 + bW % 6 * 2 + aV(bY);
                    v[bS] = (bT << 4 | bZ);
                    aw[bY] = (bT << 4 | bZ)
                }
                bH[bT++] = bR
            }
        }
    }

    function bm(bQ, bP) {
        var bT, bS, bU, bR, bV;
        bV = 1985229328;
        for (bT = 0; bT < 7; ++bT) {
            bU = (aq)[7 - bT];
            bR = ~~(bP / bU);
            bP = bP - bR * bU;
            bR <<= 2;
            bQ[bT] = (bV >> bR & 7);
            bS = (1 << bR) - 1;
            bV = (bV & bS) + (bV >> 4 & ~bS)
        }
        bQ[7] = bV
    }

    function w() {}
    var _ = W.prototype = X.prototype = ab.prototype = w.prototype;
    _.temps = null;
    var ag, aM, aw = null,
        bH, by = null,
        an, v, bF, a3, aG, aD, bL, aY, a9, ai = null,
        br, Q, aF, a = null,
        H, bG, bE, aj;

    function y(bQ, bR) {
        var bP;
        bR.temps = new ab;
        for (bP = 0; bP < 6; ++bP) {
            bQ.twist[bP] = u(bR);
            bQ.tsym[bP] = bQ.twist[bP] & 7;
            bQ.twist[bP] >>>= 3;
            bQ.flip[bP] = au(bR);
            bQ.fsym[bP] = bQ.flip[bP] & 7;
            bQ.flip[bP] >>>= 3;
            bQ.slice_0[bP] = bc(bR);
            bQ.corn0[bP] = aZ(bR);
            bQ.csym0[bP] = bQ.corn0[bP] & 15;
            bQ.corn0[bP] >>>= 4;
            bQ.mid30[bP] = bj(bR);
            bQ.e10[bP] = F(bR);
            bQ.e20[bP] = P(bR);
            bQ.prun[bP] = Math.max(Math.max((ap)[bQ.twist[bP] * 495 + U[bQ.slice_0[bP]][bQ.tsym[bP]]], az[bQ.flip[bP] * 495 + U[bQ.slice_0[bP]][bQ.fsym[bP]]]), bd[bQ.twist[bP] * 2688 + (bQ.flip[bP] << 3 | (aG)[bQ.fsym[bP]][bQ.tsym[bP]])]);
            r(bE, bR, bR.temps);
            r(bR.temps, bG, bR);
            a7(bE, bR, bR.temps);
            a7(bR.temps, bG, bR);
            bP === 2 && bK(bR)
        }
        bQ.solution = null;
        for (bQ.length1 = 0; bQ.length1 < bQ.sol; ++bQ.length1) {
            bQ.maxlength2 = Math.min(~~(bQ.sol / 2) + 1, bQ.sol - bQ.length1);
            for (bQ.urfidx = 0; bQ.urfidx < 6; ++bQ.urfidx) {
                bQ.corn[0] = bQ.corn0[bQ.urfidx];
                bQ.csym[0] = bQ.csym0[bQ.urfidx];
                bQ.mid3[0] = bQ.mid30[bQ.urfidx];
                bQ.e1[0] = bQ.e10[bQ.urfidx];
                bQ.e2[0] = bQ.e20[bQ.urfidx];
                if (bQ.prun[bQ.urfidx] <= bQ.length1 && bu(bQ, bQ.twist[bQ.urfidx], bQ.tsym[bQ.urfidx], bQ.flip[bQ.urfidx], bQ.fsym[bQ.urfidx], bQ.slice_0[bQ.urfidx], bQ.length1, 18)) {
                    return bQ.solution === null ? "Error 8" : bQ.solution
                }
            }
        }
        return "Error 7"
    }

    function aQ(bS) {
        var bY, bQ, b0, bV, bT, bW, bU, bZ, bP, b1, bX, bR;
        bS.valid2 = Math.min(bS.valid2, bS.valid1);
        for (bT = bS.valid1; bT < bS.length1; ++bT) {
            bU = bS.move[bT];
            bS.corn[bT + 1] = (a2)[bS.corn[bT]][(bL)[bS.csym[bT]][bU]];
            bS.csym[bT + 1] = a9[bS.corn[bT + 1] & 15][bS.csym[bT]];
            bS.corn[bT + 1] >>>= 4;
            bS.mid3[bT + 1] = aJ[bS.mid3[bT]][bU]
        }
        bS.valid1 = bS.length1;
        bZ = (am)[bS.mid3[bS.length1] % 24];
        bP = ay[bS.corn[bS.length1] * 24 + aa[bZ][bS.csym[bS.length1]]];
        if (bP >= bS.maxlength2) {
            return false
        }
        for (bT = bS.valid2; bT < bS.length1; ++bT) {
            bS.e1[bT + 1] = aJ[bS.e1[bT]][bS.move[bT]];
            bS.e2[bT + 1] = aJ[bS.e2[bT]][bS.move[bT]]
        }
        bS.valid2 = bS.length1;
        bY = bS.corn[bS.length1];
        bV = (aF)[~~(bS.e1[bS.length1] / 6)][~~(bS.e2[bS.length1] / 6)] * 4032 + bS.e1[bS.length1] * 12 + bS.e2[bS.length1] % 6 * 2 + (Y[bY >>> 3] >>> (bY & 7) & 1 ^ (p)[bZ]);
        bQ = v[bV];
        b0 = bQ & 15;
        bQ >>>= 4;
        bP = Math.max(f[bQ * 24 + aa[bZ][b0]], bP);
        if (bP >= bS.maxlength2) {
            return false
        }
        bW = bS.length1 === 0 ? 10 : at[~~(bS.move[bS.length1 - 1] / 3) * 3 + 1];
        for (bT = bP; bT < bS.maxlength2; ++bT) {
            if (bt(bS, bQ, b0, bS.corn[bS.length1], bS.csym[bS.length1], bZ, bT, bS.length1, bW)) {
                bS.sol = bS.length1 + bT;
                bX = "";
                bR = bS.urfidx;
                (bR = (bR + 3) % 6);
                if (bR < 3) {
                    for (b1 = 0; b1 < bS.length1; ++b1) {
                        bX += bo[aj[bR][bS.move[b1]]];
                        bX += " "
                    }
                    bS.useSeparator && (bX.impl.string += ".", bX);
                    for (b1 = bS.length1; b1 < bS.sol; ++b1) {
                        bX += bo[aj[bR][bS.move[b1]]];
                        bX += " "
                    }
                } else {
                    for (b1 = bS.sol - 1; b1 >= bS.length1; --b1) {
                        bX += bo[aj[bR][bS.move[b1]]];
                        bX += " "
                    }
                    bS.useSeparator && (bX += ".", bX);
                    for (b1 = bS.length1 - 1; b1 >= 0; --b1) {
                        bX += bo[aj[bR][bS.move[b1]]];
                        bX += " "
                    }
                }
                bS.solution = bX;
                return true
            }
        }
        return false
    }

    function bu(bT, bZ, b2, bU, bW, b1, bQ, b0) {
        var bX, bS, bV, bY, bP, bR;
        if (bZ === 0 && bU === 0 && b1 === 0 && bQ < 5) {
            return bQ === 0 && aQ(bT)
        }
        for (bV = 0; bV < 18; ++bV) {
            if ((bn)[b0][bV]) {
                bV += 2;
                continue
            }
            bY = (bp)[b1][bV];
            bR = q[bZ][bF[b2][bV]];
            bP = a3[bR & 7][b2];
            bR >>>= 3;
            if (ap[bR * 495 + U[bY][bP]] >= bQ) {
                continue
            }
            bX = aC[bU][bF[bW][bV]];
            bS = a3[bX & 7][bW];
            bX >>>= 3;
            if (bd[bR * 2688 + (bX << 3 | aG[bS][bP])] >= bQ || az[bX * 495 + U[bY][bS]] >= bQ) {
                continue
            }
            bT.move[bT.length1 - bQ] = bV;
            bT.valid1 = Math.min(bT.valid1, bT.length1 - bQ);
            if (bu(bT, bR, bP, bX, bS, bY, bQ - 1, bV)) {
                return true
            }
        }
        return false
    }

    function bt(bW, bQ, b1, b3, bS, b2, bR, bV, bZ) {
        var b0, bY, bP, bU, bX, bT;
        if (bQ === 0 && b3 === 0 && b2 === 0) {
            return true
        }
        for (bX = 0; bX < 10; ++bX) {
            if ((n)[bZ][bX]) {
                continue
            }
            bT = (bs)[b2][bX];
            bP = L[bQ][(aY)[b1][bX]];
            bU = a9[bP & 15][b1];
            bP >>>= 4;
            if (f[bP * 24 + aa[bT][bU]] >= bR) {
                continue
            }
            b0 = a2[b3][bL[bS][aS[bX]]];
            bY = a9[b0 & 15][bS];
            b0 >>>= 4;
            if (ay[b0 * 24 + aa[bT][bY]] >= bR) {
                continue
            }
            bW.move[bV] = aS[bX];
            if (bt(bW, bP, bU, b0, bY, bT, bR - 1, bV + 1, bX)) {
                return true
            }
        }
        return false
    }

    function g(bS, bP) {
        var bT, bU, bQ, bR;
        bC();
        for (bQ = 0; bQ < 54; ++bQ) {
            switch (bP.charCodeAt(bQ)) {
                case 85:
                    bS.f[bQ] = 0;
                    break;
                case 82:
                    bS.f[bQ] = 1;
                    break;
                case 70:
                    bS.f[bQ] = 2;
                    break;
                case 68:
                    bS.f[bQ] = 3;
                    break;
                case 76:
                    bS.f[bQ] = 4;
                    break;
                case 66:
                    bS.f[bQ] = 5;
                    break;
                default:
                    return "Error 1"
            }
        }
        bU = s(bS.f);
        bS.sol = 22;
        return y(bS, bU)
    }

    function aR() {
        this.move = Array(31);
        this.corn = Array(20);
        this.csym = Array(20);
        this.mid3 = Array(20);
        this.e1 = Array(20);
        this.e2 = Array(20);
        this.twist = Array(6);
        this.tsym = Array(6);
        this.flip = Array(6);
        this.fsym = Array(6);
        this.slice_0 = Array(6);
        this.corn0 = Array(6);
        this.csym0 = Array(6);
        this.mid30 = Array(6);
        this.e10 = Array(6);
        this.e20 = Array(6);
        this.prun = Array(6);
        this.count = Array(6);
        this.f = Array(54)
    }
    _ = aR.prototype;
    _.inverse = false;
    _.length1 = 0;
    _.maxlength2 = 0;
    _.sol = 999;
    _.solution = null;
    _.urfidx = 0;
    _.useSeparator = false;
    _.valid1 = 0;
    _.valid2 = 0;

    function bC(bP) {
        if (R) {
            return
        }
        N();
        bP("[0/9] Initializing Cubie Cube...");
        bI();
        by = Array(2048);
        ai = Array(2187);
        aw = Array(40320);
        bP("[1/9] Initializing Sym2Raw...");
        a5();
        bP("[2/9] Initializing CoordCube...");
        aE();
        bP("[3/9] Initializing Perm, Flip, and Twist Moves...");
        bq();
        aN();
        bw();
        V();
        bP("[4/9] Initializing UDSlice...");
        aw = null;
        by = null;
        ai = null;
        aH();
        bM();
        bP("[5/9] Initializing Mid3Move...");
        bD();
        aW();
        ax();
        bP("[6/9] Initializing Perms...");
        m();
        aO();
        bP("[7/9] Initializing TwistFlipSlicePrun...");
        bv(bP);
        bP("[8/9] Initializing MCEPermPrum...");
        a0(bP);
        bP("[9/9] Done initializing 3x3x3...");
        R = true
    }
    var R = false;

    function N() {
        N = av;
        var bQ, bP;
        d = [
            [8, 9, 20],
            [6, 18, 38],
            [0, 36, 47],
            [2, 45, 11],
            [29, 26, 15],
            [27, 44, 24],
            [33, 53, 42],
            [35, 17, 51]
        ];
        a1 = [
            [5, 10],
            [7, 19],
            [3, 37],
            [1, 46],
            [32, 16],
            [28, 25],
            [30, 43],
            [34, 52],
            [23, 12],
            [21, 41],
            [50, 39],
            [48, 14]
        ];
        bz = [
            [0, 1, 2],
            [0, 2, 4],
            [0, 4, 5],
            [0, 5, 1],
            [3, 2, 1],
            [3, 4, 2],
            [3, 5, 4],
            [3, 1, 5]
        ];
        aP = [
            [0, 1],
            [0, 2],
            [0, 4],
            [0, 5],
            [3, 1],
            [3, 2],
            [3, 4],
            [3, 5],
            [2, 1],
            [2, 4],
            [5, 4],
            [5, 1]
        ];
        bb = a6(12, 12);
        aq = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600];
        bo = ["U ", "U2", "U'", "R ", "R2", "R'", "F ", "F2", "F'", "D ", "D2", "D'", "L ", "L2", "L'", "B ", "B2", "B'"];
        aS = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];
        at = Array(18);
        bn = a6(19, 18);
        n = a6(11, 10);
        p = Array(24);
        S = [
            [11, 10, 9],
            [10, 11, 9],
            [11, 9, 10],
            [9, 11, 10],
            [10, 9, 11],
            [9, 10, 11]
        ];
        for (bQ = 0; bQ < 10; ++bQ) {
            at[aS[bQ]] = bQ
        }
        for (bQ = 0; bQ < 18; ++bQ) {
            for (bP = 0; bP < 18; ++bP) {
                bn[bQ][bP] = ~~(bQ / 3) === ~~(bP / 3) || ~~(bQ / 3) % 3 === ~~(bP / 3) % 3 && bQ >= bP
            }
            bn[18][bQ] = false
        }
        for (bQ = 0; bQ < 10; ++bQ) {
            for (bP = 0; bP < 10; ++bP) {
                n[bQ][bP] = bn[aS[bQ]][aS[bP]]
            }
            n[10][bQ] = false
        }
        for (bQ = 0; bQ < 12; ++bQ) {
            for (bP = 0; bP < 12; ++bP) {
                bb[bQ][bP] = 0
            }
        }
        for (bQ = 0; bQ < 12; ++bQ) {
            bb[bQ][0] = 1;
            bb[bQ][bQ] = 1;
            for (bP = 1; bP < bQ; ++bP) {
                bb[bQ][bP] = bb[bQ - 1][bP - 1] + bb[bQ - 1][bP]
            }
        }
        for (bQ = 0; bQ < 24; ++bQ) {
            p[bQ] = a4(bQ)
        }
    }

    function be(bP, bR) {
        var bT, bV, bQ, bS, bU;
        bV = bP.length;
        if (bR <= bP[bV - 1]) {
            bT = 0;
            bS = bV - 1;
            while (bT <= bS) {
                bQ = bT + bS >>> 1;
                bU = bP[bQ];
                if (bR > bU) {
                    bT = bQ + 1
                } else {
                    if (bR < bU) {
                        bS = bQ - 1
                    } else {
                        return bQ
                    }
                }
            }
        }
        return 65535
    }

    function ao(bP) {
        bP = bP - (bP >>> 1 & 1431655765);
        bP = (bP & 858993459) + (bP >>> 2 & 858993459);
        return bP + (bP >>> 8) + (bP >>> 4) & 15
    }

    function G(bP) {
        bP = (bP ^ bP >>> 1);
        bP = (bP ^ bP >>> 2);
        bP = (bP ^ bP >>> 4);
        bP = (bP ^ bP >>> 8);
        return (bP & 1)
    }

    function K(bP) {
        var bQ, bR;
        bR = 0;
        for (bQ = 10; bQ >= 0; --bQ) {
            bR = bR + bP % (12 - bQ);
            bP = ~~(bP / (12 - bQ))
        }
        bR = (bR & 1);
        return bR
    }

    function a4(bP) {
        var bQ, bR;
        bR = 0;
        for (bQ = 2; bQ >= 0; --bQ) {
            bR = bR + bP % (4 - bQ);
            bP = ~~(bP / (4 - bQ))
        }
        bR = (bR & 1);
        return bR
    }

    function aV(bP) {
        var bQ, bR;
        bR = 0;
        for (bQ = 6; bQ >= 0; --bQ) {
            bR = bR + bP % (8 - bQ);
            bP = ~~(bP / (8 - bQ))
        }
        bR = (bR & 1);
        return bR
    }

    function s(bS) {
        var bV, bU, bR, bQ, bP, bT;
        bV = new ab;
        for (bQ = 0; bQ < 8; ++bQ) {
            bV.cp[bQ] = 0
        }
        for (bQ = 0; bQ < 12; ++bQ) {
            bV.ep[bQ] = 0
        }
        for (bQ = 0; bQ < 8; ++bQ) {
            for (bT = 0; bT < 3; ++bT) {
                if (bS[d[bQ][bT]] === 0 || bS[d[bQ][bT]] === 3) {
                    break
                }
            }
            bU = bS[d[bQ][(bT + 1) % 3]];
            bR = bS[d[bQ][(bT + 2) % 3]];
            for (bP = 0; bP < 8; ++bP) {
                if (bU === bz[bP][1] && bR === bz[bP][2]) {
                    bV.cp[bQ] = bP;
                    bV.co[bQ] = bT % 3;
                    break
                }
            }
        }
        for (bQ = 0; bQ < 12; ++bQ) {
            for (bP = 0; bP < 12; ++bP) {
                if (bS[a1[bQ][0]] === aP[bP][0] && bS[a1[bQ][1]] === aP[bP][1]) {
                    bV.ep[bQ] = bP;
                    bV.eo[bQ] = 0;
                    break
                }
                if (bS[a1[bQ][0]] === aP[bP][1] && bS[a1[bQ][1]] === aP[bP][0]) {
                    bV.ep[bQ] = bP;
                    bV.eo[bQ] = 1;
                    break
                }
            }
        }
        return bV
    }

    function T(bQ) {
        var bW, bU, bT, bS, bR, bP, bX, bV;
        bT = Array(54);
        bV = [85, 82, 70, 68, 76, 66];
        for (bS = 0; bS < 54; ++bS) {
            bT[bS] = bV[~~(bS / 9)]
        }
        for (bW = 0; bW < 8; ++bW) {
            bR = bQ.cp[bW];
            bX = bQ.co[bW];
            for (bP = 0; bP < 3; ++bP) {
                bT[d[bW][(bP + bX) % 3]] = bV[bz[bR][bP]]
            }
        }
        for (bU = 0; bU < 12; ++bU) {
            bR = bQ.ep[bU];
            bX = bQ.eo[bU];
            for (bP = 0; bP < 2; ++bP) {
                bT[a1[bU][(bP + bX) % 2]] = bV[aP[bR][bP]]
            }
        }
        return String.fromCharCode.apply(null, bT)
    }
    var bb, bn, n, bz, d, aP, a1, aq, bo, p, S, at, aS;
    var ad = undefined;
    var k = function(bP) {
        ad = bP
    };
    var x = [
        [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ],
        [
            [9, 10, 11],
            [12, 13, 14],
            [15, 16, 17]
        ],
        [
            [18, 19, 20],
            [21, 22, 23],
            [24, 25, 26]
        ],
        [
            [36, 37, 38],
            [39, 40, 41],
            [42, 43, 44]
        ],
        [
            [45, 46, 47],
            [48, 49, 50],
            [51, 52, 53]
        ],
        [
            [27, 28, 29],
            [30, 31, 32],
            [33, 34, 35]
        ]
    ];
    var O = 2;
    var aX = 12;
    var ae = [
        [O + aX / 2 * 9, O + aX / 2 * 3],
        [O + aX / 2 * 15, O + aX / 2 * 9],
        [O + aX / 2 * 9, O + aX / 2 * 9],
        [O + aX / 2 * 3, O + aX / 2 * 9],
        [O + aX / 2 * 21, O + aX / 2 * 9],
        [O + aX / 2 * 9, O + aX / 2 * 15],
    ];

    function bA(bP) {
        if (bP === "r") {
            return ("#FF0000")
        }
        if (bP === "o") {
            return ("#FF8000")
        }
        if (bP === "b") {
            return ("#0000FF")
        }
        if (bP === "g") {
            return ("#00FF00")
        }
        if (bP === "y") {
            return ("#FFFF00")
        }
        if (bP === "w") {
            return ("#FFFFFF")
        }
        if (bP === "x") {
            return ("#000000")
        }
    }

    function aU(bP, bT, bR, bX, bQ) {
        var bW = [bT - bX, bT - bX, bT + bX, bT + bX];
        var bV = [bR - bX, bR + bX, bR + bX, bR - bX];
        var bS = "";
        for (var bU = 0; bU < bW.length; bU++) {
            bS += ((bU === 0) ? "M" : "L") + bW[bU] + "," + bV[bU]
        }
        bS += "z";
        bP.path(bS).attr({
            fill: bA(bQ),
            stroke: "#000"
        })
    }
    var al = function(bY, bR) {
        var bQ = "wrgoby";
        var bX = {
            U: bQ[0],
            R: bQ[1],
            F: bQ[2],
            L: bQ[3],
            B: bQ[4],
            D: bQ[5]
        };
        var bP = Raphael(bY, O * 2 + aX * 12, O * 2 + aX * 9);
        bY.width = O * 2 + aX * 12;
        var bV = bR + " URFLBD";
        for (var bU = 0; bU < 6; bU++) {
            for (var bT = 0; bT < 3; bT++) {
                for (var bS = 0; bS < 3; bS++) {
                    var bW = bV[x[bU][bT][bS]];
                    aU(bP, ae[bU][0] + (bS - 1) * aX, ae[bU][1] + (bT - 1) * aX, aX / 2, bX[bW])
                }
            }
        }
    };
    var aK = false;
    var af = function(bR, bQ, bP) {
        if (typeof bP !== "function") {
            bP = function() {}
        }
        if (!aK) {
            search = new aR;
            bC(bP);
            k(bQ);
            aK = true
        }
        if (bR) {
            setTimeout(bR, 0)
        }
    };
    var aB = function(bP) {
        return Math.floor(ad.random() * bP)
    };
    var ac = function(bQ) {
        var bT = [];
        for (var bS = 1; bS < bQ.length; bS++) {
            var bU = 0;
            for (var bR = 0; bR < bS; bR++) {
                if (bQ[bR] > bQ[bS]) {
                    bU++
                }
            }
            bT.push(bU)
        }
        var bP = 0;
        for (var bS = bQ.length - 1; bS > 0; bS--) {
            bP = bS * (bT[bS - 1] + bP)
        }
        return bP
    };
    var i = function(bP, bU) {
        var bT = [];
        for (var bS = 0; bS < bU.length; bS++) {
            bT.push(bP[bU[bS]])
        }
        for (var bS = 0; bS < bT.length; bS++) {
            var bR = bS + aB(bT.length - bS);
            if (bR > bS) {
                var bQ = bT[bR];
                bT[bR] = bT[bS];
                bT[bS] = bQ
            }
        }
        for (var bS = 0; bS < bU.length; bS++) {
            bP[bU[bS]] = bT[bS]
        }
        return bP
    };
    var bl = function(bW, b1, bY, bP) {
        var bZ, bV, bQ, b0, bU, bR;
        do {
            bV = ac(i([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], b1));
            bZ = ac(i([0, 1, 2, 3, 4, 5, 6, 7], bW))
        } while ((aV(bZ) ^ K(bV)) != 0);
        do {
            b0 = 0;
            bQ = 0;
            for (var bT = 0; bT < bY.length; bT++) {
                var bS = aB(3);
                b0 += bS;
                bQ += bS * Math.pow(3, bY[bT])
            }
        } while (b0 % 3 != 0);
        do {
            bR = 0;
            bU = 0;
            for (var bT = 0; bT < bP.length; bT++) {
                var bS = aB(2);
                bR += bS;
                bU += bS * Math.pow(2, bP[bT])
            }
        } while (bR % 2 != 0);
        var bX = T(new X(bZ, bQ % 2187, bV, bU % 2048));
        return g(search, bX)
    };
    var z = function(bW, b0, bQ, bY, bP) {
        var bZ, bU, bQ, bY, bV, bR;
        do {
            bU = ac(i([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], b0));
            bZ = ac(i([0, 1, 2, 3, 4, 5, 6, 7], bW))
        } while ((aV(bZ) ^ K(bU)) != 0);
        do {
            bR = 0;
            bV = 0;
            for (var bT = 0; bT < bP.length; bT++) {
                var bS = aB(2);
                bR += bS;
                bV += bS * Math.pow(2, bP[bT])
            }
        } while (bR % 2 != 0);
        var bX = T(new X(bZ, bQ % 2187, bU, bV % 2048));
        return g(search, bX)
    };
    var ak = function() {
        return bl([0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    };
    var t = function() {
        return bl([], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    };
    var D = function() {
        return bl([0, 1, 2, 3, 4, 5, 6, 7], [], [0, 1, 2, 3, 4, 5, 6, 7], [])
    };
    var I = function() {
        return bl([4, 5, 6, 7], [8, 9, 10, 11], [3, 4, 5, 6], [0, 1, 2, 3])
    };
    var ba = function() {
        return bl([4, 5, 6, 7], [4, 6, 8, 9, 10, 11], [3, 4, 5, 6], [0, 1, 2, 3, 5, 7])
    };
    var lse = function() {
        return bl([], [4, 6, 8, 9, 10, 11], [], [0, 1, 2, 3, 5, 7])
    };
    var bg = function() {
        return bl([3, 4, 5, 6, 7], [3, 8, 9, 10, 11], [2, 3, 4, 5, 6], [0, 1, 2, 3, 8])
    };
    var b = function() {
        return bl([4, 5, 6, 7], [8, 9, 10, 11], [3, 4, 5, 6], [])
    };
    var aA = function() {
        return bl([], [8, 9, 10, 11], [3, 4, 5, 6], [])
    };
    var A = function() {
        return bl([], [8, 9, 10, 11], [], [0, 1, 2, 3])
    };
    var h = function() {
        return bl([4, 5, 6, 7], [], [3, 4, 5, 6], [])
    };
    var l = function() {
        return bl([4, 5, 6, 7], [8, 9, 10, 11], [], [])
    };
    var bN = function() {
        return bl([], [], [3, 4, 5, 6], [0, 1, 2, 3])
    };
    var bk = function(bQ, bP) {
        return z([4, 5, 6, 7], [8, 9, 10, 11], bQ, bP, [])
    };
    var a8 = function(bQ, bP) {
        return z([4, 5, 6, 7], [8, 9, 10, 11], bQ, bP, [0, 1, 2, 3])
    };
    var bf = function(bQ, bP) {
        return z([4, 5, 6, 7], [], bQ, bP, [])
    };
    return {
        version: "November 22, 2011",
        initialize: af,
        setRandomSource: k,
        getRandomScramble: ak,
        drawScramble: al,
        getEdgeScramble: t,
        getCornerScramble: D,
        getLLScramble: I,
        getCMLLScramble: ba,
        getLSEScramble: lse,
        getLSLLScramble: bg,
        getZBLLScramble: b,
        getZBLLSubScramble: bk,
        getLLSubScramble: a8,
        getCLLSubScramble: bf,
        get2GLLScramble: aA,
        getELLScramble: A,
        getCLLScramble: h,
        getPLLScramble: l,
        getOLLScramble: bN
    }
})();

scramblers['333'].initialize(null, Math); // LOAD SCRAMBLER

export default scramblers['333'];