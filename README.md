# vue-msa-overview

## Synopsis

Vue component for displaying an overview of a multiple sequence alignment.

## Installation

npm install --save vue-msa-overview

## Usage

~~~~
import { MsaOverview } from 'vue-msa-overview';
~~~~

~~~~
<msa-overview :seqs="seqs">
~~~~

seqs must be an array of this type :
~~~~
[
    {seq:"ACGT"},
    {seq:"ATGC"}
]
~~~~

With a predefined selection:
~~~~
<msa-overview :seqs="seqs" :selection="selection">
~~~~

selection must be an object of this type :
~~~~
{ startSeq: 3, endSeq: 5, startPos: 2, endPos: 4 }
~~~~

startSeq, endSeq : indices for the sequences
startPos, endPos : indices for the column

All indices start by 0.

An event is emitted with the indices of sequences and columns selected by hand.


## Troubleshootings

Accept only nucleic acids A, C, G, T or U and "."

## Contributors
[LIPM Bioinfo Team](http://lipm-bioinfo.toulouse.inra.fr/)

 * Ludovic Cottret
 * Erika Sallet
 * Sébastien Carrère
 * Ludovic Legrand
 * Jérôme Gouzy


## Contact

ludovic.cottret@inra.fr