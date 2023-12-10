#!/usr/bin/env nextflow

params.input_file = "input.fastq.gz"
params.output_dir = "output"

process porechop {
    publishDir "${params.output_dir}/porechop", mode: 'copy'

    input:
    file input_file from file(params.input_file)

    output:
    file "porechop_output.fastq.gz" into porechop_out

    """
    porechop -i ${input_file} -o porechop_output.fastq.gz
    """
}

process filtlong {
    publishDir "${params.output_dir}/filtlong", mode: 'copy'

    input:
    file input_file from porechop_out

    output:
    file "filtlong_output.fastq.gz" into filtlong_out

    """
    filtlong --min_length 1000 --keep_percent 90 --target_bases 5000000000 ${input_file} | gzip > filtlong_output.fastq.gz
    """ 
}

process flye {
    publishDir "${params.output_dir}/flye", mode: 'copy'

    input:
    file input_file from filtlong_out

    output:
    file "assembly/"

    """
    flye --nano-raw ${input_file} --meta --out-dir assembly
    """
}

