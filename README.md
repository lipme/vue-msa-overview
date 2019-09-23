# vue-msa-overview

## Version

0.2.0
Predefined seection

## Synopsis

Vue component for displaying an overview of a multiple sequence alignment.

## installation

npm install --save vue-msa-overview

## usage

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


## troubleshootings

Accept only nucleic acids A, C, G, T or U and "."

## contact

ludovic.cottret@inra.fr